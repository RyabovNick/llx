const Clients = require('../models/clients')
const { ErrorWithStatus } = require('../lib/error')

module.exports = async function(request, reply) {
  if (!request.headers['api_key']) throw new ErrorWithStatus('api_key not found', 400)

  const api_key = request.headers['api_key']

  const client = await Clients.findOne({
    where: {
      api_key
    }
  })

  if (!client) throw new ErrorWithStatus('Permission denied', 403)

  request.client = {
    ...client.dataValues
  }
}
