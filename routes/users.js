"use strict"

const express = require('express');
const router = express.Router();
const User = require('../lib/models/user')
const crypto = require('crypto'),
      algorithm = 'aes-256-ctr',
      password = 'M0CKUP'

function encrypt(text) {
  let cipher = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')

  return crypted
}

router
.post('/', function(req, res, next) {
  if (!req.body) {
    res
      .status(403)
      .json({error: true, message: 'Peticion invalida'})
  }

  let _user = req.body
  new User.findOne({username: _user.username},
    (err, user) => {
      if (err) {
        res
          .status(403)
          .json({error: true, message: err})
      }
      else if (user) {
        res
          .status(200)
          .json({error: true, message: 'El usuario existe'})
      }
      else {
        new User({
          username: _user.username,
          password: encrypt(_user.password)
        })
        .save((err, user) => {
          res
            .status(201)
            .json({user: user})
        })
      }
    }
  )
})

module.exports = router;
