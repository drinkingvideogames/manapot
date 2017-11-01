const path = require('path')
const multer = require('multer')
const router = require('express').Router()
const Model = require('../models/Asset')
const { ensureAuthenticated } = require('./auth')
const { handleError, returnResponse } = require('./lib/util')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(path.join(__dirname, '..', 'public', 'uploads')))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage })
const assetUpload = upload.fields([{ name: 'assets' }])

router.options('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  res.send(200)
})

router.get('/', (req, res) => {
  Model.find()
    .then((items) => {
      if (!items) return res.status(401).send({ msg: 'No resources exist' })
      res.send(items)
    })
    .catch(handleError(res))
})

router.get('/:id', (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Model.findById(req.params.id)
    .then((item) => {
      if (!item) return res.status(401).send({ msg: 'No resource exists by that id' })
      res.send(item)
    })
    .catch(handleError(res))
})

router.put('/:id', ensureAuthenticated, (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Model.findOneAndUpdate({ _id: req.params.id }, Object.assign({ updatedBy: req.user._id }, req.body))
    .then(returnResponse(res))
    .catch(handleError(res))
})

router.post('/', ensureAuthenticated, assetUpload, (req, res) => {
  const assetCreates = req.files && req.files.assets.map((file) => {
    return Model.create({ createdBy: req.user._id, updatedBy: req.user._id, file })
  }) || []
  Promise.all(assetCreates)
    .then(returnResponse(res))
    .catch(handleError(res))
})

router.delete('/:id', ensureAuthenticated, (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Model.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount === 0) return res.status(401).send({ msg: 'No resource exists by that id' })
      res.send(result)
    })
    .catch(handleError(res))
})

module.exports = router
