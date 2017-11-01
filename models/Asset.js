const mongoose = require('mongoose')
const mongooseHistory = require('mongoose-history')
const Schema = mongoose.Schema

const AssetSchema = new Schema({
  file: { type: Object, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
}, { timestamps: true })

AssetSchema.plugin(mongooseHistory)

AssetSchema.pre('save', function (next) {
  this.file.url = this.file.url || (this.file.path && this.file.path.replace(/\/.+?\/public/, ''))
  next()
})

const AssetModel = mongoose.model('Asset', AssetSchema)

module.exports = AssetModel
