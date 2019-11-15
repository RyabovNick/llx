const schema = require('../schemes/genToken')
const Users = require('../models/users')
const nanoid = require('nanoid')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const QRCode = require('qrcode')
const { ws } = require('./wsClients')

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
  },
  wsHandler: async (conn, req) => {
    // const token = nanoid(16)

    // await Users.create({
    //   token,
    //   client_id: 1,
    //   expired_at: moment()
    //     .add(5, 'minutes')
    //     .format('YYYY-MM-DD HH:mm:ss')
    // })

    // const telegramWebUrl = `https://t.me/${__env.LLX_TG_BOT}?start=${token}`
    // const telegramAppUrl = `tg://resolve?domain=${__env.LLX_TG_BOT}&start=${token}`
    // const telegramQr = await QRCode.toDataURL(telegramAppUrl)

    // const signToken = jwt.sign(
    //   {
    //     token,
    //     sources: {
    //       telegram: {
    //         webUrl: telegramWebUrl,
    //         appUrl: telegramAppUrl,
    //         qr: telegramQr
    //       }
    //     }
    //   },
    //   req.client.secret,
    //   {
    //     expiresIn: 5 * 1000
    //   }
    // )

    // const response = { token: signToken }

    // ws[token] = conn

    console.log('conn: ', conn)
    console.log('req: ', req)
    // this will handle websockets connections
    conn.setEncoding('utf8')
    conn.write('hello client')

    conn.socket.on('message', message => {
      conn.socket.send('test1234')
      //conn.socket.send(JSON.stringify(response))
    })

    // conn.once('data', chunk => {
    //   conn.end()
    // })

    conn.on('error', err => {
      console.log(err)
    })
  }
})
