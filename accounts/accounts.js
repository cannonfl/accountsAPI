'use strict'

const config = require('config')
const jwt = require('jsonwebtoken')
const logger = require('../logger/logger')

class Accounts {
  constructor (AccountsDaoMock, authMock) {
    let AccountsDao = AccountsDaoMock || require('./AccountsDao')
    this.accountsDao = new AccountsDao ()
    this.auth = authMock || require('../auth/auth')
  }

  sendResponse (res, statusCode, params) {
    logger.info('Accounts.sendResponse', { params: params })

    res.status(statusCode)
    res.setHeader('Content-Type', 'application/json')
    res.json(params)
  }

  async find (req, res) {
    let userName = req.params.userName
    logger.info('Accounts.getAccount', {userName: userName})
    let message

    try {
      let response = await this.accountsDao.find(userName)
      if (response.success) {
        let account = response.account
        account = {
          userName: account.userName,
          type: account.type,
          fname: account.fname,
          lname: account.lname,
          phone: account.phone,
          email: account.email,
          contactPref: account.contactPref
        }
        message = 'Accounts found'
        logger.info('Accounts.find', {userName: userName, message: message})
        this.sendResponse(res, 200, {account: account})
      } else {
        message = 'Accounts not found'
        logger.warn('Accounts.find', {userName: userName, message: message})
        this.sendResponse(res, 403, {message: 'User not found'})
      }
    } catch (err) {
      message = 'Internal system failure'
      logger.error('Accounts.find', {userName: userName, message: message})
      this.sendResponse(res, 500, {message: message, error: err})
    }
  }

  async authenticate (account, password) {
    logger.info('Accounts.authenticate')
    let authenticated
    let authentication = await this.auth.validatePassword(account.password, password)
    if (authentication.validated) {
      if (authentication.hash) {
        account.password = authentication.hash
        await this.accountsDao.saveAccount(account)
      }
      authenticated = true
    }
    return authenticated
  }

  async login (req, res) {
    let userName = req.params.userName
    logger.info('Accounts.login', {userName: userName})
    let message

    try {
      let response = await this.accountsDao.find(userName)
      if (response.success) {
        let account = response.account
        let password = req.headers.password
        let authenticated = await this.authenticate(account, password)
        if (!authenticated) {
          message = 'User not authenticated'
          logger.info('Accounts.login', {message: message})
          this.sendResponse(res, 403, {message: message})
        } else {
          const payload = {
            userName: response.userName
          }
          let token = jwt.sign(payload, config.ujob.secret, {
            expiresIn: '1d'
          })
          account = {
            userName: account.userName,
            type: account.type,
            fname: account.fname,
            lname: account.lname,
            phone: account.phone,
            email: account.email,
            contactPref: account.contactPref
          }
          message = 'User authenticated'
          logger.info('Accounts.login', {userName: userName, message: message})
          this.sendResponse(res, 200, {success: true, token: token, account: account})
        }
      } else {
        message = 'User not found'
        logger.warn('Accounts.login', {userName: userName, message: message})
        this.sendResponse(res, 403, {message: message})
      }
    } catch (err) {
      message = 'Internal system failure'
      logger.error('Accounts.login', {userName: userName, message: message, error: err})
      this.sendResponse(res, 500, {message: message})
    }
  }

  async create (req, res) {
    let userName = req.headers.username
    logger.info('Accounts.create')
    let body = req.body
    let message

    try {
      let account = {
        type: body.type,
        userName: userName,
        password: req.headers.password,
        fname: body.fname,
        lname: body.lname,
        phone: body.phone,
        email: body.email,
        contactPref: body.contactPref
      }
      account.password = await this.auth.hashPassword(account.password)
      let response = await this.accountsDao.insert(account)
      if (response.success) {
        message = 'Accounts created successfully'
        logger.info('Accounts.create', {userName: userName, message: message})
        this.sendResponse(res, 200, {message: message})
      } else {
        message = 'Unable to create account'
        logger.warn('Accounts.create', {userName: userName, message: message})
        this.sendResponse(res, 403, {message: message})
      }
    } catch (err) {
      message = 'Internal system failure'
      logger.error('Accounts.create', {userName: userName, message: message, error: err})
      this.sendResponse(res, 500, {message: message, error: err})
    }
  }

  async update (req, res) {
    let userName = req.params.userName
    logger.info('Accounts.update', {userName: userName})
    let body = req.body
    let message

    try {
      let account = {
        type: body.type,
        userName: userName,
        password: null || req.headers.password,
        fname: body.fname,
        lname: body.lname,
        phone: body.phone,
        email: body.email,
        contactPref: body.contactPref
      }
      if (account.password) {
        account.password = await this.auth.hashPassword(account.password)
      }
      let response = await this.accountsDao.update(account)
      if (response.success) {
        message = 'Accounts updated successfully'
        logger.info('Accounts.update', {userName: userName, message: message})
        this.sendResponse(res, 200, {message: message})
      } else {
        message = 'Unable to update account'
        logger.warn('Accounts.update', {userName: userName, message: message})
        this.sendResponse(res, 403, {message: 'Unable to update account'})
      }
    } catch (err) {
      message = 'Internal system failure'
      logger.error('Accounts.update', {userName: userName, message: message, error: err})
      this.sendResponse(res, 500, {message: message, error: err})
    }
  }

  async delete (req, res) {
    let userName = req.params.userName
    logger.info('Accounts.delete', { userName: userName })

    let message
    try {
      let response = await this.accountsDao.delete(userName)
      if (response.success) {
        message = 'Accounts delete successfully'
        logger.info('Accounts.deleteAccount', {userName: userName, message: message})
        this.sendResponse(res, 200, {message: message})
      } else {
        message = 'Nothing to delete'
        logger.warn('Accounts.deleteAccount', {userName: userName, message: message})
        this.sendResponse(res, 403, {message: message})
      }
    } catch (err) {
      console.log(err)
      message = 'Internal system failure'
      logger.error('Accounts.deleteAccount', {userName: userName, message: message, error: err})
      this.sendResponse(res, 500, {message: message, error: err})
    }
  }
}

module.exports = Accounts
