const base = require('./base')

module.exports = Object.assign({}, base, {
  state: {
    subheading: String,
    listBullet: 'File',
    list: Array
  }
})
