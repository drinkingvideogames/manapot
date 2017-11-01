const base = require('./base')

module.exports = Object.assign({}, base, {
  state: {
    raw: {
      Blocks: Array,
      entityMap: Object
    }
  }
})
