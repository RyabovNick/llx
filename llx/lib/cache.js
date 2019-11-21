const LRU = require('lru-cache')

const options = {
  max: 5000,
  length: function(n, key) {
    return n * 2 + key.length
  },
  dispose: function(key, n) {
    n.close()
  },
  maxAge: 5 * 60 * 1000
}

const cache = new LRU(options)

module.exports = {
  cache
}
