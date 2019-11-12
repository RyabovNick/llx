const Users = require('../models/users')
const nanoid = require('nanoid')
const moment = require('moment')
const jwt = require('jsonwebtoken')

fastify.route({
  method: 'GET',
  url: __filename
    .replace(__entry, '')
    .replace(/\\/g, '/')
    .replace('.js', ''),
  preValidation: [fastify.auth],
  handler: async req => {
    const token = nanoid(16)

    await Users.create({
      token,
      client_id: req.client.id,
      expired_at: moment()
        .add(5, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss')
    })

    const signToken = jwt.sign(
      {
        token
      },
      req.client.secret,
      {
        expiresIn: 5 * 1000
      }
    )

    return { token: signToken }
  }
})
