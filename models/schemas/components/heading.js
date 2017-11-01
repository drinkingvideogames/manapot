const base = require('./base')

module.exports = Object.assign({}, base, {
  state: {
    type: String,
    text: String
  }
})
