const mongoose = require('mongoose')
const mongooseHistory = require('mongoose-history')
const Schema = mongoose.Schema

const GameSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true },
  modifiedBy: { type: Schema.Types.ObjectId, required: true },
  url: { type: String, required: true },
  images: { type: Object },
  genreId: { type: String }
})

GameSchema.index({ 'name': -1, background: true })

GameSchema.plugin(mongooseHistory)

const GameModel = mongoose.model('Game', GameSchema)

module.exports = GameModel
