const schema = require('../schemes/genToken')
const Users = require('../models/users')
const nanoid = require('nanoid')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { generateLinks } = require('../lib/generateLinks')
const { cache } = require('../lib/cache')

fastify.route({
  method: 'GET',
  url:
    __filename
      .replace(__entry, '')
      .replace(/\\/g, '/')
      .replace('.js', '') + '/:source',
  schema,
  preValidation: [fastify.auth],
  handler: async req => {
    const { source } = req.params
    const token = nanoid(16)

    await Users.create({
      token,
      client_id: req.client.id,
      expired_at: moment()
        .add(5, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss')
    })

    const { appUrl, webUrl, qr } = await generateLinks({ source, token })

    cache.set(token, 'waiting')

    const signToken = jwt.sign(
      {
        token,
        appUrl,
        webUrl,
        qr
      },
      req.client.secret,
      {
        expiresIn: 5 * 1000
      }
    )

    return { token: signToken }
  }
})
