const fastify = require('fastify')({ logger: true })
const routes = require('./routes');
const keys = require('./keys.json');

fastify.addHook('onRequest', async (request, reply) => {
  // Try to get the API key from the header first
  let apiKey = request.headers['x-api-key'];

  // If not found, try to get it from the query string
  if (!apiKey) {
    apiKey = request.query['x-api-key'];
  }

  // If the API key is still not found or doesn't match any key in your list, reject the request
  if (!apiKey || !keys.keys.includes(apiKey)) {
    reply.code(401).send({ message: 'Invalid API Key' });
  }
});

fastify.register(routes);

fastify.get('/', async (request, reply) => {
  return { hello: 'world' }
})


const start = async () => {
  try {
    await fastify.listen({
      port: 3000
    })
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
    console.info('Handling routes:\n', fastify.printRoutes());
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
