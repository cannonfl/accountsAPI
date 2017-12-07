'use strict'

let Joi = require('joi')

module.exports.createAccount = {
  headers: {
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  },
  body: {
    type: Joi.string().required(),
    fname: Joi.string().min(3).max(30).required(),
    lname: Joi.string().min(3).max(30).required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    contactPref: Joi.string().min(1).max(1).required()
  }
}
module.exports.loginAccount = {
  headers: {
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  },
  params: {
    userName: Joi.string().required()
  }
}

module.exports.deleteAccount = {
  params: {
    userName: Joi.string().required()
  }
}
module.exports.updateAccount = {
  params: {
    userName: Joi.string().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
  },
  body: {
    type: Joi.string(),
    fname: Joi.string().min(3).max(30),
    lname: Joi.string().min(3).max(30),
    phone: Joi.string(),
    email: Joi.string().email(),
    contactPref: Joi.string().min(1).max(1)
  }
}
module.exports.getAccount = {
  params: {
    userName: Joi.string().required()
  }
}
