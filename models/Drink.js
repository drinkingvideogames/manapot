const mongoose = require('mongoose')
const mongooseHistory = require('mongoose-history')
const mongoosePaginate = require('mongoose-paginate')
const mongooseAutopopulate = require('mongoose-autopopulate')
const mongooseVoting = require('mongoose-voting')
const Schema = mongoose.Schema

const DrinkSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User', autopopulate: true },
  updatedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User', autopopulate: true },
  game: { type: Schema.Types.ObjectId, required: true, ref: 'Game', autopopulate: true },
  url: { type: String, required: true },
  mainColour: { type: String, required: true },
  bgColour: { type: String, required: true },
  layout: { type: Array, required: true }
}, { timestamps: true })

DrinkSchema.index({ 'name': -1, background: true })

DrinkSchema.plugin(mongooseHistory)
DrinkSchema.plugin(mongooseAutopopulate)
DrinkSchema.plugin(mongooseVoting, { ref: 'User' })
DrinkSchema.plugin(mongoosePaginate)

const DrinkModel = mongoose.model('Drink', DrinkSchema)

module.exports = DrinkModel
