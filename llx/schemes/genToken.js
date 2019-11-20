module.exports = {
  params: {
    type: 'object',
    properties: {
      source: {
        type: 'string',
        enum: ['telegram', 'whatsapp', 'viber']
      }
    }
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
