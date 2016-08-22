"use strict"

let request = require('supertest-as-promised')
const api = require('../app')
const host = api
const mongoose = require('mongoose')
const config = require('../lib/config')

request = request(host)

describe('Ruta para los usuarios', function() {
  describe('POST /', function() {

    before(() => {
      mongoose.connect(config.database)
    })

    after((done) => {
      mongoose.disconnect(done)
      mongoose.models = {}
    })

    it('deberia crear un nuevo usuario', function(done) {
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
      .end((err, res) => {
        let body = res.body
        expect(body).to.have.property('user')

        let user = body.user
        expect(user).to.have.property('_id')
        expect(user).to.have.property('username', 'Cristian')
        done(err)
      })
    })
  })
})