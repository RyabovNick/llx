const schema = require('../schemes/checkAuth')
const Users = require('../models/users')
const jwt = require('jsonwebtoken')
const { getUserStatus } = require('../lib/getUserStatus')
const { cache } = require('../lib/cache')

const timeout = ms => new Promise(resovle => setTimeout(resovle, ms))

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

    let jwtPayload = getUserStatus(user)

    if (jwtPayload.status === 'waiting') {
      while (true) {
        await timeout(500)
        const userStatus = cache.peek(token)

        if (!userStatus || userStatus === 'ok') break
      }

      const authenticatedUser = await Users.findOne({
        where: {
          token
        }
      })

      jwtPayload = getUserStatus(authenticatedUser)
    }

    const signToken = jwt.sign(jwtPayload, req.client.secret, {
      expiresIn: 5 * 60 * 1000
    })

    return { token: signToken }
  }
})
