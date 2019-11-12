const { getJwtPayload } = require('../lib/getJwtPayload')

describe('getJwtPayload function', () => {
  describe('run function', () => {
    it('user is null', done => {
      const user = null
      const jwtPayload = getJwtPayload(user)

      expect(jwtPayload).toHaveProperty('status')
      expect(jwtPayload).toHaveProperty('message')
      expect(jwtPayload).toHaveProperty('payload')

      expect(jwtPayload.status).toBe('error')

      done()
    })

    it('user is not null', done => {
      const user = {}
      const jwtPayload = getJwtPayload(user)

      expect(jwtPayload).toHaveProperty('status')
      expect(jwtPayload).toHaveProperty('message')
      expect(jwtPayload).toHaveProperty('payload')

      expect(jwtPayload.status).toBe('serverError')

      done()
    })

    it('user with now date is after expired_at', done => {
      const user = {
        expired_at: '2019-11-12 07:16:39'
      }
      const jwtPayload = getJwtPayload(user)

      expect(jwtPayload).toHaveProperty('status')
      expect(jwtPayload).toHaveProperty('message')
      expect(jwtPayload).toHaveProperty('payload')

      expect(jwtPayload.status).toBe('expired')

      done()
    })

    it('user with now date is before expired_at and w/o payload', done => {
      const user = {
        expired_at: '2025-01-01 07:16:39'
      }
      const jwtPayload = getJwtPayload(user)

      expect(jwtPayload).toHaveProperty('status')
      expect(jwtPayload).toHaveProperty('message')
      expect(jwtPayload).toHaveProperty('payload')

      expect(jwtPayload.status).toBe('waiting')

      done()
    })

    it('user with now date is before expired_at ant w/ payload', done => {
      const user = {
        expired_at: '2025-01-01 07:16:39',
        payload: {
          test: '123',
          telegram: '123'
        }
      }
      const jwtPayload = getJwtPayload(user)

      expect(jwtPayload).toHaveProperty('status')
      expect(jwtPayload).toHaveProperty('message')
      expect(jwtPayload).toHaveProperty('payload')

      expect(jwtPayload.status).toBe('ok')
      expect(jwtPayload.payload).toHaveProperty('test')
      expect(jwtPayload.payload).toHaveProperty('telegram')

      done()
    })
  })
})
