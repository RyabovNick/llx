const schema = require('../schemes/genToken')
const Users = require('../models/users')
const nanoid = require('nanoid')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const QRCode = require('qrcode')

fastify.route({
  method: 'GET',
  url: __filename
    .replace(__entry, '')
    .replace(/\\/g, '/')
    .replace('.js', ''),
  schema,
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

    const telegramWebUrl = `https://t.me/${__env.LLX_TG_BOT}?start=${token}`
    const telegramAppUrl = `tg://resolve?domain=${__env.LLX_TG_BOT}&start=${token}`
    const telegramQr = await QRCode.toDataURL(telegramAppUrl)

    const signToken = jwt.sign(
      {
        token,
        sources: {
          telegram: {
            webUrl: telegramWebUrl,
            appUrl: telegramAppUrl,
            qr: telegramQr
          }
        }
      },
      req.client.secret,
      {
        expiresIn: 5 * 1000
      }
    )

    return { token: signToken }
  }
})
