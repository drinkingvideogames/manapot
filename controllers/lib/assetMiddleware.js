const path = require('path')
const multer = require('multer')
const Asset = require('../../models/Asset')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(path.join(__dirname, '..', '..', 'public', 'uploads')))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

function createAssetMiddleware (fields, options) {
  let assetFields = Array.isArray(fields) ? fields : [ fields ]
  const upload = multer({ storage })
  const assetUpload = upload.fields(assetFields)
  return function assetMiddleware (req, res, next) {
    assetUpload(req, res, (err) => {
      if (err) return next(err)
      if (!req.user) return next(new Error('Missing user, cannot create assets'))
      if (req.files && Object.keys(req.files).length) {
        const assetPromises = Object.keys(req.files).map((key) => (
          createAsset(req.user, key, req.files[key])
        ))
        Promise.all(assetPromises)
          .then((items) => {
            const overrides = items.reduce((ids, item) => {
              const data = options.preserveAssetObject ? item : item._id
              return Object.assign(ids, { [item.key]: data })
            }, {})
            req.body = Object.assign({}, req.body, overrides)
            next()
          })
          .catch(next)
      } else {
        console.log('NO FILES')
        next()
      }
    })
  }
}

function createAsset (user, key, file) {
  return Asset.create({ file, createdBy: user._id, updatedBy: user._id })
    .then((item) => {
      return { key, fieldname: item.fieldname, _id: item._id }
    })
}

module.exports = createAssetMiddleware
