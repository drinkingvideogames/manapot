const router = require('express').Router()
const Model = require('../models/User')
const Game = require('../models/Game')
const Drink = require('../models/Drink')
const { handleError, returnResponse } = require('./lib/util')

router.get('/', (req, res) => {
  Model.find()
    .populate('roles')
    .then((items) => {
      if (!items) return res.status(401).send({ msg: 'No resources exist' })
      res.send(items.map((i) => (i.toJSON({ virtuals: true }))))
    })
    .catch(handleError(res))
})

router.get('/profile/:name', (req, res) => {
  if (!req.params.name) return res.status(400).send({ msg: 'Requires name' })
  Model.findOne({ name: req.params.name })
    .then((item) => {
      if (!item) return res.status(401).send({ msg: 'No resource exists by that id' })
      res.send(item.toJSON({ virtuals: true }))
    })
    .catch(handleError(res))
})

router.get('/games/:name', (req, res) => {
  if (!req.params.name) return res.status(400).send({ msg: 'Requires name' })
  Model.findOne({ name: req.params.name })
    .then((item) => {
      Game.find({ createdBy: item._id })
        .populate('createdBy')
        .populate('updatedBy')
        .populate('banner')
        .then((items) => {
          res.send(items.map((i) => (i.toJSON({ virtuals: true }))))
        })
        .catch(handleError(res))
    })
    .catch(handleError(res))
})

router.get('/drinks/:name', (req, res) => {
  if (!req.params.name) return res.status(400).send({ msg: 'Requires name' })
  Model.findOne({ name: req.params.name })
    .then((item) => {
      Drink.find({ createdBy: item._id })
        .populate('createdBy')
        .populate('updatedBy')
        .populate('game')
        .then((items) => {
          res.send(items.map((i) => (i.toJSON({ virtuals: true }))))
        })
        .catch((handleError(res)))
    })
    .catch(handleError(res))
})

router.get('/:id', (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Model.findById(req.params.id)
    .populate('roles')
    .then((item) => {
      if (!item) return res.status(401).send({ msg: 'No resource exists by that id' })
      res.send(item.toJSON({ virtuals: true }))
    })
    .catch(handleError(res))
})

router.patch('/:id/roles', (req, res) => {
  if (!req.params.id) return res.status(400).send({ msg: 'Requires id' })
  Model.findOneAndUpdate({ _id: req.params.id }, { $set: { roles: req.body } }, { new: true })
    .populate('roles')
    .then((items) => {
      if (!items) return res.status(401).send({ msg: 'No resources exist' })
      res.send(items.map((i) => (i.toJSON({ virtuals: true }))))
    })
    .catch(handleError(res))
})

module.exports = router
