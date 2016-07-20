"use strict"

let request = require('supertest-as-promised')
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
})