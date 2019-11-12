module.exports = {
  body: {
    type: 'object',
    properties: {
      token: {
        type: 'string'
      }
    },
    required: ['token']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        token: { type: 'string' }
      }
    }
  }
}
