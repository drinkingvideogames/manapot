const router = require('express').Router()
const Model = require('../models/Drink')
const Game = require('../models/Game')
const { handleError, returnResponse } = require('./lib/util')

router.get('/', (req, res) => {
  Model.find()
    .then((items) => {
      if (!items) return res.status(401).send({ msg: 'No resources exist' })
      res.send(items)
    })
    .catch(handleError(res))
})

router.get('/game/:gameId', (req, res) => {
  if (!req.params.gameId) return res.status(401).send({ msg: 'Requires game id' })
  Model.find({ game: req.params.gameId })
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

router.put('/:id', (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Model.replaceOne({ _id: req.params.id }, Object.assign({ modifiedBy: req.user._id }, req.body))
    .then(returnResponse(res))
    .catch(handleError(res))
})

router.post('/', (req, res) => {
  Game.findOne(({ url: req.body.gameUrl }))
    .then((game) => {
      if (!game) return res.status(401).send({ msg: 'No game exists' })
      Model.create(Object.assign({ createdBy: req.user._id, modifiedBy: req.user._id, game: game._id }, req.body))
        .then(returnResponse(res))
        .catch(handleError(res))
    })
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
