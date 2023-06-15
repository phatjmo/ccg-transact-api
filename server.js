const fastify = require('fastify')({ logger: true })
const routes = require('./routes');

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
