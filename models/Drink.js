const mongoose = require('mongoose')
const mongooseHistory = require('mongoose-history')
const mongooseVoting = require('mongoose-voting')
const Schema = mongoose.Schema

const DrinkSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  game: { type: Schema.Types.ObjectId, required: true, ref: 'Game' },
  url: { type: String, required: true },
  mainColour: { type: String, required: true },
  bgColour: { type: String, required: true },
  layout: { type: Array, required: true }
}, { timestamps: true })

DrinkSchema.index({ 'name': -1, background: true })

DrinkSchema.plugin(mongooseHistory)
DrinkSchema.plugin(mongooseVoting, { ref: 'User' })

const DrinkModel = mongoose.model('Drink', DrinkSchema)

module.exports = DrinkModel
