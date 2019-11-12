module.exports = {
  body: {
    type: 'object',
    properties: {
      token: {
        type: 'string'
      },
      payload: {
        type: 'object'
      }
    },
    required: ['token', 'payload']
  },
  response: {
    200: {
      type: 'boolean'
    }
  }
}
