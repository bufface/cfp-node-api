"use strict"

let request = require('supertest-as-promised')
const api = require('../app')
const host = api
const mongoose = require('mongoose')
const config = require('../lib/config')

request = request(host)

describe('Ruta para los auth', function() {
  describe('POST /', function() {
    before(() => {
      mongoose.connect(config.database)
    })

    after((done) => {
      mongoose.disconnect(done)
      mongoose.models = {}
    })
    it('deberia autenticar un usuario', function(done) {
      let user = {
        'username': 'Cristian',
        'password': 'cr1st14n'
      }

      request
        .post('/user')
        .set('Accept', 'application/json')
        .send(user)
        .expect(201)
        .expect('Content-Type',  /application\/json/)
        .then((res) => {
          return request
                  .post('/auth')
                  .set('Accept', 'application/json')
                  .send(user)
                  .expect(201)
                  expect('Content-Type',  /application\/json/)
        })
        .then((res) => {
          let body = res.body

          expect(body).to.have.property('token')
          done()
        }, done)
    })
  })
})