const router = require('express').Router()
const Model = require('../models/Drink')
const Game = require('../models/Game')
const { ensureAuthenticated } = require('./auth')
const { handleError, returnResponse, constructPageQuery } = require('./lib/util')
const { assetMiddleware, componentAssetMiddleware } = require('./lib/middlewares')

router.get('/', (req, res) => {
  const paginate = constructPageQuery(req, [ 'game' ])
  const query = {}
  if (req.query.q) Object.assign(query, { name: { $regex: new RegExp(req.query.q, 'gi') } })
  Model.paginate(query, paginate)
    .then(returnResponse(res))
    .catch(handleError(res))
})

router.get('/game/:gameId', (req, res) => {
  if (!req.params.gameId) return res.status(404).send({ msg: 'Requires game id' })
  const paginate = constructPageQuery(req, [ 'game' ])
  Model.paginate({ game: req.params.gameId }, paginate)
    .then(returnResponse(res))
    .catch(handleError(res))
})

router.get('/url/:url', (req, res) => {
  if (!req.params.url) return res.status(400).send({ msg: 'Requires url' })
  Model.findOne({ url: req.params.url })
    .then(returnResponse(res))
    .catch(handleError(res))
})

router.get('/:drinkId/vote/', (req, res) => {
  if (!req.params.drinkId) return res.status(401).send({ msg: 'Requires id' })
  Model.findById(req.params.drinkId)
    .then((item) => {
      if (!item) return res.status(401).send({ msg: 'No resources exist' })
      const data = {
        voted: item.voted(req.user._id),
        vote: item.upvoted(req.user._id) ? 'up' : (item.downvoted(req.user._id) ? 'down' : 'unknown')
      }
      returnResponse(res)(data)
    })
    .catch(handleError(res))
})

router.get('/:id', (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Model.findById(req.params.id)
    .then(returnResponse)
    .catch(handleError(res))
})

router.put('/:id', ensureAuthenticated, assetMiddleware(), /*componentAssetMiddleware(),*/ (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Game.findOne(({ url: req.body.gameUrl }))
    .then((game) => {
      if (!game) return res.status(401).send({ msg: 'No game exists' })
      Model.findOneAndUpdate({ _id: req.params.id }, Object.assign({ updatedBy: req.user._id, game: game._id }, req.body))
        .then(returnResponse(res))
        .catch(handleError(res))
    })
    .catch(handleError(res))
})

router.post('/', ensureAuthenticated, assetMiddleware(), /*componentAssetMiddleware(),*/ (req, res) => {
  Game.findOne(({ url: req.body.gameUrl }))
    .then((game) => {
      if (!game) return res.status(401).send({ msg: 'No game exists' })
      Model.create(Object.assign({ createdBy: req.user._id, updatedBy: req.user._id, game: game._id }, req.body))
        .then(returnResponse(res))
        .catch(handleError(res))
    })
    .catch(handleError(res))
})

router.post('/:drinkId/vote/:vote', ensureAuthenticated, (req, res) => {
  if (!req.params.drinkId) return res.status(401).send({ msg: 'Requires id' })
  if (req.params.vote !== 'up' && req.params.vote !== 'down') return res.status(401).send({ msg: 'Vote must be up or down' })
  Model.findById(req.params.drinkId)
    .then((item) => {
      if (!item) return res.status(401).send({ msg: 'No resources exist' })
      const method = req.params.vote === 'up' ? 'upvote' : 'downvote'
      item[method](req.user._id, function (err, doc) {
        if (err) return handleError(res)(err)
        returnResponse(res)(doc)
      })
    })
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
