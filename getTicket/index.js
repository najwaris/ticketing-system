const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('getTicket', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;

    const client = new CosmosClient({ endpoint, key });
    const container = client.database("QuickAidDB").container("Tickets");

    const email = request.query.get('email');

    let query;

    if (email) {
      query = {
        query: "SELECT * FROM Tickets t WHERE t.email = @email",
        parameters: [{ name: "@email", value: email }]
      };
    } else {
      query = { query: "SELECT * FROM Tickets t" };
    }

    try {
      const { resources: results } = await container.items.query(query).fetchAll();
      return {
        status: 200,
        jsonBody: results
      };
    } catch (err) {
      return {
        status: 500,
        body: `Error: ${err.message}`
      };
    }
  }
});
