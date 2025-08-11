const { app } = require("@azure/functions");
const { CosmosClient } = require("@azure/cosmos");
const { v4: uuidv4 } = require("uuid");

app.http("submitTicket", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;

    const client = new CosmosClient({ endpoint, key });
    const container = client.database("QuickAidDB").container("Tickets");

    const ticket = await request.json();
    ticket.id = uuidv4();

    try {
      await container.items.create(ticket);

      return {
        status: 201,
        jsonBody: {
          message: "Ticket submitted successfully!",
          ticket_id: ticket.id,
        },
      };
    } catch (err) {
      return {
        status: 500,
        body: `Error: ${err.message}`,
      };
    }
  },
});
