const LRU = require('lru-cache')

const options = {
  max: 5000,
  maxAge: 5 * 60 * 1000
}

const cache = new LRU(options)

module.exports = {
  cache
}
