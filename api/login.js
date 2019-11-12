const Users = require('../models/users')
const { ErrorWithStatus } = require('../lib/error')
const { Op } = require('sequelize')
const moment = require('moment')
const schema = require('../schemes/login')
const { getUserStatus } = require('../lib/getUserStatus')

fastify.route({
  method: 'POST',
  url: __filename
    .replace(__entry, '')
    .replace(/\\/g, '/')
    .replace('.js', ''),
  // temp API auth for bots with env
  preValidation: async (request, reply) => {
    if (!request.headers['access_token']) throw new ErrorWithStatus('Permission denied', 403)

    const access_token = request.headers['access_token']

    if (access_token !== __env.BOT_ACCESS_TOKEN) throw new ErrorWithStatus('Permission denied', 403)

    return
  },
  schema,
  handler: async req => {
    const { token, payload } = req.body

    const User = await Users.findOne({
      where: {
        token
      }
    })

    const userStatus = getUserStatus(User)

    const exceptedUserStatus = 'waiting'

    if (userStatus.status !== exceptedUserStatus) throw new ErrorWithStatus(userStatus.message, 400)

    const [result] = await Users.update(
      {
        payload
      },
      {
        where: {
          token,
          expired_at: {
            [Op.gte]: moment().format('YYYY-MM-DD HH:mm:ss')
          },
          payload: null
        }
      }
    )

    return !result ? false : true
  }
})
