const mongoose = require('mongoose')
const Asset = require('./Asset')
const mongooseHistory = require('mongoose-history')
const mongoosePaginate = require('mongoose-paginate')
const mongooseAutopopulate = require('mongoose-autopopulate')
const Schema = mongoose.Schema

const GameSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User', autopopulate: true },
  updatedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User', autopopulate: true },
  url: { type: String, required: true },
  banner: { type: Schema.Types.ObjectId, ref: 'Asset', autopopulate: true },
  genreId: { type: String }
}, { timestamps: true })

GameSchema.index({ 'name': -1, background: true })

GameSchema.plugin(mongooseHistory)
GameSchema.plugin(mongooseAutopopulate)
GameSchema.plugin(mongoosePaginate)

const GameModel = mongoose.model('Game', GameSchema)

module.exports = GameModel
