const mongoose = require('mongoose')
const Asset = require('./Asset')
const mongooseHistory = require('mongoose-history')
const Schema = mongoose.Schema

const GameSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  url: { type: String, required: true },
  banner: { type: Schema.Types.ObjectId, ref: 'Asset' },
  genreId: { type: String }
}, { timestamps: true })

GameSchema.index({ 'name': -1, background: true })

GameSchema.plugin(mongooseHistory)

const GameModel = mongoose.model('Game', GameSchema)

module.exports = GameModel
