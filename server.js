'use strict'

const config = require('config')
const express = require('express')
const logger = require('./logger/logger')
const validator = require('express-validation')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const AccountRoutes = require('./accounts/AccountsRoutes')

class Server {
  constructor (AccountsMock) {
    this.accountRoutes = new AccountRoutes(AccountsMock)

    this.app = express()
    this.app.use(bodyParser.json())
    this.app.use(cookieParser())

    this.app.get('/', (req, res) => res.json({message: 'Welcome to uJobs'}))
    this.app.use('/v1/accounts', this.accountRoutes.apiRoutes)
    this.app.use(function (err, req, res, next) {
      if (err instanceof validator.ValidationError) {
        return res.status(err.status).json(err)
      }
    })
  }

  start () {
    let port = config.ujob.port
    this.app.listen(port, function () {
      logger.info(`API server listening on port ${port}!`)
    })
  }
}

module.exports = Server
