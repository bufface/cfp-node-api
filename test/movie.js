"use strict"

let request = require('supertest-as-promised')
const _ = require('lodash')
const api = require('../app')
const host = api

request = request(host)

describe('La ruta de Peliculas', function () {
  describe('Una peticion a POST', function () {
    it('Deberia crear una Pelicula', function (done) {
      let movie = {
        'title': 'Back To The Future',
        'year': '1985'
      }

      request
        .post('/movie')
        .set('Accept', 'application/json')
        .send(movie)
        .expect(201)
        .expect('Content-Type',  /application\/json/)
        .end((err, res) => {
          let body = res.body
          expect(body).to.have.property('movie')
          movie = body.movie

          expect(movie).to.have.property('title', 'Back To The Future')
          expect(movie).to.have.property('year', '1985')
          expect(movie).to.have.property('_id')

          done(err)
        })
    })
  })

  describe('Una peticion GET', function () {
    it('Deberia obtener todas las peliculas', function (done) {
      let movie_id
      let movie2_id

      let movie = {
        'title': 'Back To The Future',
        'year': '1985'
      }

      let movie2 = {
        'title': 'Back To The Future 2',
        'year': '1989'
      }

      request
        .post('/movie')
        .set('Accept', 'application/json')
        .send(movie)
        .expect(201)
        .expect('Content-Type',  /application\/json/)
        .then((res) => {
          movie_id = res.body.movie._id

          return request
            .post('/movie')
            .set('Accept', 'application/json')
            .send(movie2)
            .expect(201)
            .expect('Content-Type',  /application\/json/)
        })
        .then((res) => {
          movie2_id = res.body.movie._id

          return request
          .get('/movie')
          .set('Accept', 'application/json')
          .expect(200)
          .expect('Content-Type',  /application\/json/)
        }, done)
        .then((res) => {
          let body = res.body

          expect(body).to.have.property('movies')
          expect(body.movies)
            .to.be.an('array')
            .and.to.have.length.above(2)

          let movies = body.movies
          movie = _.find(movies, {_id: movie_id})
          movie2 = _.find(movies, {_id: movie2_id})
          expect(movie).to.have.property('_id', movie_id)
          expect(movie).to.have.property('title', 'Back To The Future')
          expect(movie).to.have.property('year', '1985')

          expect(movie2).to.have.property('_id', movie2_id)
          expect(movie2).to.have.property('title', 'Back To The Future 2')
          expect(movie2).to.have.property('year', '1989')

          done()
        }, done)
    })
  })
})