"use strict"

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../lib/models/user')
const config = require('../lib/config')

const crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      password = 'M0CKUP'

function encrypt(text) {
  let cipher = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')

  return crypted
}

function decrypt(text) {
  let decipher = crypto.createDecipher(algorithm, password)
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')

  return dec
}

router.post('/', function(req, res, next) {
  if (!req.body) {
    res
      .status(403)
      .json({error: true, message: 'Peticion invalida'})
  }

  let _user = req.body
  User.findOne({username: _user.username},
    (err, user) => {
      if (err) {
        res
          .status(403)
          .json({error: true, message: err})
      }
      else if (user) {
        if (user.password === encrypt(_user.password)) {
          let token = jwt.sign(user, config.secret, {expiresIn: '24hr'})

          res
            .status(201)
            .json({token: token})
        }
      }
      else {
        res
          .status(403)
          .json({error: true, message: 'Fallo en Login'})
      }
    })
});

module.exports = router;
