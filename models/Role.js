const mongoose = require('mongoose')
const mongooseHistory = require('mongoose-history')
const Schema = mongoose.Schema

const permissions = {
    game: [ 'create', 'delete', 'edit' ],
    drinkinggame: [ 'create', 'delete', 'edit' ],
    genre: [ 'create', 'delete', 'edit' ],
    news: [ 'create', 'delete', 'edit' ],
    feature: [ 'create', 'delete', 'edit' ],
    admin: [ 'all' ]
}

const flatPerms = Object.keys(permissions).reduce((perms, key) => {
    return perms.concat(permissions[key].map((perm) => `${key}:${perm}`))
}, [])

const validator = (v) => {
    return flatPerms.includes(v)
}

const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  permissions: [ { type: String, validate: { validator } } ]
}, { timestamps: true })

RoleSchema.statics.permissions = () => {
    return permissions
}

RoleSchema.statics.flatPermissions = () => {
    return flatPerms
}

RoleSchema.index({ 'name': -1, background: true })

RoleSchema.plugin(mongooseHistory)

const RoleModel = mongoose.model('Role', RoleSchema)

module.exports = RoleModel
