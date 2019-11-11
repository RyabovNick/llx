const Database = require('./engine/database')
const logger = require('pino')({ prettyPrint: process.env.FASTIFY_PRETTY })
const fastify = require('fastify')({ logger })
const loader = require('fastify-loader')
const cors = require('fastify-cors')

fastify.setErrorHandler((error, request, reply) => {
  reply
    .headers({
      'access-control-allow-credentials': 'true',
      'access-control-allow-headers': 'Content-Type, Authorization',
      'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      'access-control-allow-origin': '*',
      'access-control-expose-headers': 'token'
    })
    .code(418)
    .send({
      statusCode: 400,
      error: 'Bad Request',
      message: error.message
    })
})

fastify.register(cors, {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['token'],
  credentials: true
})

fastify.register(loader, {
  paths: ['./api/**/*.js'],
  inject: {
    __entry: __dirname,
    __env: process.env
  }
})

Database.authenticate().then(async () => {
  fastify.listen(3001, '0.0.0.0', async err => {
    if (err) console.trace(err)
  })
})

module.exports = fastify
