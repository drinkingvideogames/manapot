const mongoose = require('mongoose')
const mongooseHistory = require('mongoose-history')
const Schema = mongoose.Schema

const GenreSchema = new Schema({
  name: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
})

GenreSchema.index({ 'name': -1, background: true })

GenreSchema.plugin(mongooseHistory)

const GenreModel = mongoose.model('Genre', GenreSchema)

module.exports = GenreModel
