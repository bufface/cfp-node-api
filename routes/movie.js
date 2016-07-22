"use strict"

const express = require('express')
const router = express.Router()
const _ = require('lodash');
const Movie = require('../lib/models/movie')

router
.post('/', function(req, res, next) {
  console.log('POST: ', req.body)
  if (!req.body) {
    res
      .status(403)
      .json({error: true, message: 'Peticion invalida'})
  }

  let _movie = req.body

  new Movie({
    title: _movie.title,
    year: _movie.year
  })
  .save((err, movie) => {
    if (err) {
      res
        .status(403)
        .json({error: true, message: 'Error DB'})
    }
    res
      .status(201)
      .json({movie: movie})
  })
})

.get('/', function (req, res, next) {
  console.log('GET: ', req.body)

  Movie.find({}, (err, movies) => {
    if (err) {
      res
        .status(403)
        .json({error: true, message: 'Error DB'})
    }
    res
    .status(200)
    .json({movies: movies})
  })
})

.get('/:id', function (req, res, next) {
  console.log('GET:id ', req.params.id)
  if (!req.params.id) {
    res
      .status(403)
      .json({error: true, message: 'Paramertro invalido'})
  }

  let _id = req.params.id
  Movie.findOne({_id: _id}, (err, movie) => {
    if (err) {
      res
        .status(403)
        .json({error: true, message: 'Error DB'})
    }
    res
    .status(200)
    .json({movie: movie})
  })
})

.put('/:id', function (req, res, next) {
  console.log('PUT:id ', req.params.id)
  if (!req.params.id && !req.body) {
    res
      .status(403)
      .json({error: true, message: 'Paramertro invalido'})
  }

  let _id = req.params.id
  let new_movie = req.body

  Movie.findByIdAndUpdate(_id, {
    title: new_movie.title,
    year: new_movie.year
  }, {new: true}, (err, movie) => {
    if (err) {
      res
        .status(403)
        .json({error: true, message: 'Error DB'})
    }
    res
      .status(200)
      .json({movie: movie})
  })
})

.delete('/:id', function (req, res, next) {
  console.log('DELETE:id ', req.params.id)
  if (!req.params.id) {
    res
      .status(403)
      .json({error: true, message: 'Paramertro invalido'})
  }

  let _id = req.params.id

  Movie.findByIdAndRemove(_id, (err, done) => {
    res
      .status(400)
      .json({})
  })
})

module.exports = router