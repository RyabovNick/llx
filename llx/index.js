require('dotenv').config({
  path: '.env.local'
})
const Database = require('./engine/database')
const logger = require('pino')({ prettyPrint: process.env.FASTIFY_PRETTY })
const fastify = require('fastify')({ logger })
const loader = require('fastify-loader')
const cors = require('fastify-cors')
const AuthDecorator = require('./decorators/auth')
const { getStatus } = require('./lib/getStatus')

fastify.setErrorHandler((error, request, reply) => {
  const headers = {
    'access-control-allow-credentials': 'true',
    'access-control-allow-headers': 'Content-Type, Authorization',
    'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    'access-control-allow-origin': '*',
    'access-control-expose-headers': 'token'
  }

  const statusCode = getStatus(error)

  const body = {
    statusCode,
    error: 'Bad Request',
    message: error.message_i18n || error.message
  }

  reply
    .headers(headers)
    .code(statusCode)
    .send(body)
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
  fastify.listen(process.env.PORT, '0.0.0.0', async err => {
    if (err) console.trace(err)
  })
})

fastify.decorate('auth', AuthDecorator)

module.exports = fastify
