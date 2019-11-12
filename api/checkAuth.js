const schema = require('../schemes/checkAuth')
const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const { getJwtPayload } = require('../lib/getJwtPayload')

fastify.route({
  method: 'POST',
  url: __filename
    .replace(__entry, '')
    .replace(/\\/g, '/')
    .replace('.js', ''),
  preValidation: [fastify.auth],
  schema,
  handler: async req => {
    const { token } = req.body

    const user = await Users.findOne({
      where: {
        token
      }
    })

    const jwtPayload = getJwtPayload(user)

    const signToken = jwt.sign(jwtPayload, req.client.secret, {
      expiresIn: 5 * 60 * 1000
    })

    return { token: signToken }
  }
})
