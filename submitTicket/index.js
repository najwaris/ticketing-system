// /api/submitTicket/index.js
const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');
const { v4: uuidv4 } = require('uuid');
const sgMail = require('@sendgrid/mail');

app.http('submitTicket', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      // --- 1) Load secrets from env (wire these to Key Vault in Azure App Settings) ---
      const COSMOS_ENDPOINT = process.env.COSMOS_ENDPOINT;
      const COSMOS_KEY = process.env.COSMOS_KEY;
      const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
      const SENDGRID_FROM = process.env.SENDGRID_FROM || 'noreply@quickaid.example';

      if (!COSMOS_ENDPOINT || !COSMOS_KEY) {
        throw new Error('Cosmos DB credentials are missing.');
      }
      if (!SENDGRID_API_KEY) {
        throw new Error('SendGrid API key is missing.');
      }

      // --- 2) Parse and validate payload ---
      const ticket = await request.json().catch(() => ({}));
      const { email, subject, description } = ticket;

      if (!email || !subject || !description) {
        return {
          status: 400,
          jsonBody: { error: 'email, subject, and description are required.' },
        };
      }

      // add system fields
      ticket.id = uuidv4();
      ticket.status = ticket.status || 'OPEN';
      ticket.createdAt = new Date().toISOString();

      // --- 3) Write to Cosmos ---
      const client = new CosmosClient({ endpoint: COSMOS_ENDPOINT, key: COSMOS_KEY });
      const container = client.database('QuickAidDB').container('Tickets');
      await container.items.create(ticket);

      // --- 4) Send email via SendGrid ---
      sgMail.setApiKey(SENDGRID_API_KEY);

      const msg = {
        to: email,
        from: SENDGRID_FROM,
        subject: `QuickAid: Ticket received (${ticket.id})`,
        text:
`Hi,

We’ve received your ticket.

ID: ${ticket.id}
Subject: ${subject}

You’ll get updates by email. Thanks!
— QuickAid Helpdesk`,
        html:
`<p>Hi,</p>
<p>We’ve received your ticket.</p>
<p><strong>ID:</strong> ${ticket.id}<br/>
<strong>Subject:</strong> ${subject}</p>
<p>You’ll get updates by email. Thanks!<br/>— QuickAid Helpdesk</p>`
      };

      // Best‑effort email: don’t fail the whole request if SendGrid is down.
      try {
        await sgMail.send(msg);
      } catch (e) {
        context.warn(`SendGrid warning: ${e.message}`);
        if (e.response && e.response.body) {
          context.warn(`SendGrid response: ${JSON.stringify(e.response.body)}`);
        }
      }

      // --- 5) Respond ---
      return {
        status: 201,
        jsonBody: {
          message: 'Ticket submitted successfully!',
          ticket_id: ticket.id,
        },
      };
    } catch (err) {
      context.error(err);
      return { status: 500, jsonBody: { error: err.message } };
    }
  }
});