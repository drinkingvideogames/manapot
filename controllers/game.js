const path = require('path')
const mongoose = require('mongoose')
const multer = require('multer')
const router = require('express').Router()
const Model = require('../models/Game')
const { handleError, returnResponse } = require('./lib/util')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('destinationing', file)
    cb(null, path.resolve(path.join(__dirname, '..', 'public', 'uploads')))
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
})
const upload = multer({ storage })
const gameUpload = upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'header', maxCount: 1 }])

router.get('/:id', (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Model.findById(req.params.id)
    .then((item) => {
      if (!item) return res.status(401).send({ msg: 'No resource exists by that id' })
      res.send(item)
    })
    .catch(handleError(res))
})

router.put('/:id', gameUpload, (req, res) => {
  console.log('Uploading', req.files)
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Model.replaceOne({ _id: req.params.id }, Object.assign({ images: req.files }, req.body))
    .then(returnResponse(res))
    .catch(handleError(res))
})

router.post('/', gameUpload, (req, res) => {
  console.log('Uploading', req.files)
  Model.create(Object.assign({ images: req.files }, req.body))
    .then(returnResponse(res))
    .catch(handleError(res))
})

router.delete('/:id', (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Model.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount === 0) return res.status(401).send({ msg: 'No resource exists by that id' })
      res.send(result)
    })
    .catch(handleError(res))
})

module.exports = router
