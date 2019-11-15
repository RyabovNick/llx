const { fastify } = require('./fastify.start')
const nanoid = require('nanoid')

afterAll(() => {
  fastify.close()
})

describe('/genToken endpoint', () => {
  describe('access to API', () => {
    it('api_key not found', async done => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/api/genToken'
      })

      expect(response.statusCode).toBe(400)

      const jsonBody = JSON.parse(response.body)

      expect(jsonBody).toHaveProperty('statusCode')
      expect(jsonBody).toHaveProperty('error')
      expect(jsonBody).toHaveProperty('message')

      done()
    })

    it('random api_key set', async done => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/api/genToken',
        headers: {
          api_key: nanoid(16)
        }
      })

      expect(response.statusCode).toBe(403)

      const jsonBody = JSON.parse(response.body)

      expect(jsonBody).toHaveProperty('statusCode')
      expect(jsonBody).toHaveProperty('error')
      expect(jsonBody).toHaveProperty('message')

      done()
    })

    it('active api_key set', async done => {
      const response = await fastify.inject({
        method: 'GET',
        url: '/api/genToken',
        headers: {
          api_key: process.env.TEST_API_KEY
        }
      })

      expect(response.statusCode).toBe(200)

      const jsonBody = JSON.parse(response.body)

      expect(jsonBody).toHaveProperty('token')

      done()
    })
  })
})
