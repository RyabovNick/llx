require('dotenv').config({
  path: '.env.local'
})
const Database = require('./engine/database')
const logger = require('pino')({ prettyPrint: process.env.FASTIFY_PRETTY })
const fastify = require('fastify')({ logger })
const loader = require('fastify-loader')
const cors = require('fastify-cors')
const ws = require('fastify-websocket')
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
    message: error.message_i18n
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

function handle(conn) {
  conn.pipe(conn)
  conn.socket.send('hi from server2')
}

fastify.register(ws, {
  options: { maxPayload: 1048576 }
})

fastify.register(loader, {
  paths: ['./api/**/*.js'],
  inject: {
    __entry: __dirname,
    __env: process.env
  }
})

Database.authenticate().then(async () => {
  fastify.listen(3003, '0.0.0.0', async err => {
    if (err) console.trace(err)
  })
})

fastify.decorate('auth', AuthDecorator)

module.exports = fastify
