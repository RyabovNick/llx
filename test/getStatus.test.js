const { getStatus } = require('../lib/getStatus')

describe('getStatus function', () => {
  describe('run function', () => {
    it('error is null', done => {
      const error = null
      const status = getStatus(error)

      expect(status).toBe(400)

      done()
    })

    it('not null error w/o statusCode & validation', done => {
      const error = {}
      const status = getStatus(error)

      expect(status).toBe(400)

      done()
    })

    it('error statusCode set', done => {
      const error = {
        statusCode: 500
      }
      const status = getStatus(error)

      expect(status).toBe(error.statusCode)

      done()
    })

    it('validation set', done => {
      const error = {
        validation: {}
      }
      const status = getStatus(error)

      expect(status).toBe(422)

      done()
    })
  })
})
