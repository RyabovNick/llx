const { fastify } = require('./fastify.start')
const nanoid = require('nanoid')

afterAll(() => {
  fastify.close()
})

describe('/login endpoint', () => {
  describe('access to API', () => {
    it('access_token not found', async done => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/login'
      })

      expect(response.statusCode).toBe(403)

      const jsonBody = JSON.parse(response.body)

      expect(jsonBody).toHaveProperty('statusCode')
      expect(jsonBody).toHaveProperty('error')
      expect(jsonBody).toHaveProperty('message')

      done()
    })

    it('random access_token set with empty body', async done => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/login',
        headers: {
          access_token: nanoid(16)
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
        url: '/api/login',
        headers: {
          access_token: process.env.BOT_ACCESS_TOKEN
        }
      })

      expect(response.statusCode).toBe(422)

      const jsonBody = JSON.parse(response.body)

      expect(jsonBody).toHaveProperty('statusCode')
      expect(jsonBody).toHaveProperty('error')
      expect(jsonBody).toHaveProperty('message')

      done()
    })

    it('valid access_token and random token w/o payload', async done => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/login',
        payload: {
          token: nanoid(16)
        },
        headers: {
          access_token: process.env.BOT_ACCESS_TOKEN
        }
      })

      expect(response.statusCode).toBe(422)

      const jsonBody = JSON.parse(response.body)

      expect(jsonBody).toHaveProperty('statusCode')
      expect(jsonBody).toHaveProperty('error')
      expect(jsonBody).toHaveProperty('message')

      done()
    })

    it('valid access_token and payload (expired token)', async done => {
      const response = await fastify.inject({
        method: 'POST',
        url: '/api/login',
        payload: {
          token: process.env.TEST_USER_TOKEN,
          payload: {
            telegram: 1231535
          }
        },
        headers: {
          access_token: process.env.BOT_ACCESS_TOKEN
        }
      })

      expect(response.statusCode).toBe(400)

      const jsonBody = JSON.parse(response.body)

      expect(jsonBody).toHaveProperty('statusCode')
      expect(jsonBody).toHaveProperty('error')
      expect(jsonBody).toHaveProperty('message')

      done()
    })
  })
})
