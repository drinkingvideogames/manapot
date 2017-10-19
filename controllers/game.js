const path = require('path')
const multer = require('multer')
const router = require('express').Router()
const Model = require('../models/Game')
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
const gameUpload = upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'banner', maxCount: 1 }])

router.get('/', (req, res) => {
  const query = {}
  if (req.query.q) Object.assign(query, { name: { $regex: new RegExp(req.query.q, 'gi') } })
  Model.find(query)
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

router.get('/url/:url', (req, res) => {
  if (!req.params.url) return res.status(400).send({ msg: 'Requires url' })
  Model.find({ url: req.params.url })
    .then((item) => {
      if (!item) return res.status(401).send({ msg: 'No resource exists by that id' })
      res.send(item)
    })
    .catch(handleError(res))
})

router.put('/:id', ensureAuthenticated, gameUpload, (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  console.log('body', req.body, 'files', req.files);
  const existingImages = req.body.images ? JSON.parse(req.body.images) : {}
  Model.replaceOne({ _id: req.params.id }, Object.assign({}, req.body, { images: Object.assign(existingImages, req.files), modifiedBy: req.user._id }))
    .then(returnResponse(res))
    .catch(handleError(res))
})

router.post('/', ensureAuthenticated, gameUpload, (req, res) => {
  console.log('body', req.body, 'files', req.files);
  Model.create(Object.assign({}, req.body, { images: req.files, createdBy: req.user._id, modifiedBy: req.user._id }))
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
