const { app } = require('@azure/functions');
const { CosmosClient } = require('@azure/cosmos');

app.http('getTicket', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const endpoint = process.env.COSMOS_ENDPOINT;
    const key = process.env.COSMOS_KEY;

    const client = new CosmosClient({ endpoint, key });
    const container = client.database('QuickAidDB').container('Tickets');

    const id = request.query.get('id');   // ← use ticket id instead of email

    try {
      if (id) {
        // Query by id (works regardless of partition key)
        const query = {
          query: 'SELECT * FROM c WHERE c.id = @id',
          parameters: [{ name: '@id', value: id }]
        };
        const { resources } = await container.items.query(query).fetchAll();

        if (!resources || resources.length === 0) {
          return { status: 404, jsonBody: { error: 'Ticket not found', id } };
        }
        // If multiple somehow match, return the first (ids should be unique)
        return { status: 200, jsonBody: resources[0] };
      }

      // No id provided → return all (optional; remove if you want to force id)
      const { resources: all } = await container.items.query('SELECT * FROM c').fetchAll();
      return { status: 200, jsonBody: all };

    } catch (err) {
      return { status: 500, jsonBody: { error: err.message } };
    }
  }
});
