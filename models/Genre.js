const mongoose = require('mongoose')
const mongooseHistory = require('mongoose-history')
const Schema = mongoose.Schema

const GenreSchema = new Schema({
  name: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true })

GenreSchema.index({ 'name': -1, background: true })

GenreSchema.plugin(mongooseHistory)

const GenreModel = mongoose.model('Genre', GenreSchema)

module.exports = GenreModel
