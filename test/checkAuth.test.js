const { fastify } = require('./fastify.start')
const nanoid = require('nanoid')
const jwt = require('jsonwebtoken')

afterAll(() => {
  fastify.close()
})

describe('/checkAuth endpoint', () => {
  describe('access to API', () => {
    it('api_key not found', async done => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/checkAuth'
      })

      expect(response.statusCode).toBe(400)

      const jsonBody = JSON.parse(response.body)

      expect(jsonBody).toHaveProperty('statusCode')
      expect(jsonBody).toHaveProperty('error')
      expect(jsonBody).toHaveProperty('message')

      done()
    })

    it('random api_key set with empty body', async done => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/checkAuth',
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

    it('empty body', async done => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/checkAuth',
        headers: {
          api_key: process.env.TEST_API_KEY
        }
      })

      expect(response.statusCode).toBe(422)

      const jsonBody = JSON.parse(response.body)

      expect(jsonBody).toHaveProperty('statusCode')
      expect(jsonBody).toHaveProperty('error')
      expect(jsonBody).toHaveProperty('message')

      done()
    })

    it('random token', async done => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/checkAuth',
        payload: {
          token: nanoid(16)
        },
        headers: {
          api_key: process.env.TEST_API_KEY
        }
      })

      expect(response.statusCode).toBe(200)

      const jsonBody = JSON.parse(response.body)
      expect(jsonBody).toHaveProperty('token')
      const decodedToken = jwt.decode(jsonBody.token)

      expect(decodedToken).toHaveProperty('status')
      expect(decodedToken).toHaveProperty('message')
      expect(decodedToken).toHaveProperty('payload')
      expect(decodedToken).toHaveProperty('iat')
      expect(decodedToken).toHaveProperty('exp')

      expect(decodedToken.status).toBe('error')

      done()
    })
  })
})
