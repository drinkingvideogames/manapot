var crypto = require('crypto')
var bcrypt = require('bcrypt-nodejs')
var mongoose = require('mongoose')

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}

var userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  picture: String,
  facebook: String,
  twitter: String,
  google: String,
  roles: [ { type: mongoose.Schema.ObjectId, ref: 'Role' } ]
}, schemaOptions)

userSchema.pre('save', function (next) {
  var user = this
  if (!user.isModified('password')) { return next() }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err)
      user.password = hash
      next()
    })
  })
})

userSchema.methods.can = function (action) {
  console.log(this.roles)
  return true
}

userSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err)
    cb(err, isMatch)
  })
}

userSchema.virtual('gravatar').get(function () {
  if (!this.get('email')) {
    return 'https://gravatar.com/avatar/?s=200&d=retro'
  }
  var md5 = crypto.createHash('md5').update(this.get('email')).digest('hex')
  return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro'
})

userSchema.virtual('permissions').get(function () {
  console.log('permissions')
  const flattenedPerms = this.roles.reduce((perms, role) => (perms.concat(role.permissions)), [])
  const uniquePerms = new Set(flattenedPerms)
  return [ ...uniquePerms ]
})

userSchema.options.toJSON = {
  transform: (doc, ret, options) => {
    delete ret.password
    delete ret.passwordResetToken
    delete ret.passwordResetExpires
  }
}

userSchema.options.toObject = {
  transform: (doc, ret, options) => {
    delete ret.password
    delete ret.passwordResetToken
    delete ret.passwordResetExpires
  }
}

var User = mongoose.model('User', userSchema)

module.exports = User
