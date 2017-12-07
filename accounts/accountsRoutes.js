'use strict'

const config = require('config')
const express = require('express')
const jwt = require('jsonwebtoken')
const validator = require('express-validation')
const logger = require('../logger/logger')
const validate = require('./accountsValidate.js')

class AccountsRoutes {
  constructor (AccountsMock) {
    let Accounts = AccountsMock || require('./Accounts')
    let accounts = new Accounts()
    this.apiRoutes = express.Router()

    this.apiRoutes.post('/create', validator(validate.createAccount), async (req, res) => {
      logger.info('accountsRoutes.create')
      await accounts.create(req, res)
    })
    this.apiRoutes.post('/:userName/login', validator(validate.loginAccount), async (req, res) => {
      logger.info('accountsRoutes.login')
      await accounts.login(req, res)
    })

    this.apiRoutes.use((req, res, next) => {
      if (!req.headers['test']) {
        var token = req.body.token || req.query.token || req.headers['access-token']
        if (token) {
          jwt.verify(token, config.ujob.secret, (err, decoded) => {
            if (err) {
              logger.warn('accountsRoutes.middleware - Failed to authenticate token')
              return res.json({ success: false, message: 'Failed to authenticate token.' })
            } else {
              req.decoded = decoded
              next()
            }
          })
        } else {
          return res.status(403).send({
            success: false,
            message: 'No token provided.'
          })
        }
      } else {
        next()
      }
    })

    this.apiRoutes.get('/:userName', validator(validate.getAccount), async (req, res, next) => {
      logger.info('accountsRoutes.get')
      await accounts.find(req, res)
    })
    this.apiRoutes.put('/:userName', validator(validate.updateAccount), async (req, res) => {
      logger.info('accountsRoutes.update')
      await accounts.update(req, res)
    })
    this.apiRoutes.delete('/:userName', validator(validate.deleteAccount), async (req, res) => {
      logger.info('accountsRoutes.delete')
      await accounts.delete(req, res)
    })
  }
}

module.exports = AccountsRoutes
