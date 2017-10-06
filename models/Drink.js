const mongoose = require('mongoose')
const mongooseHistory = require('mongoose-history')
const Schema = mongoose.Schema

const DrinkSchema = new Schema({
  name: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true },
  modifiedBy: { type: Schema.Types.ObjectId, required: true },
  url: { type: String, required: true },
  steps: { type: Array, required: true }
})

DrinkSchema.index({ 'name': -1, background: true })

DrinkSchema.plugin(mongooseHistory)

const DrinkModel = mongoose.model('Drink', DrinkSchema)

module.exports = DrinkModel
