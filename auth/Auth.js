'use strict'

const Promise = require('bluebird')
const securePassword = require('secure-password')
const config = require('config')
const logger = require('../logger/logger')

let pwd

class Auth {
  constructor () {
    let authConfig = config.get('ujob.authConfig')
    pwd = Promise.promisifyAll(securePassword({
      memlimit: authConfig.memLimit,
      opslimit: authConfig.opsLimit
    }))
  }

  async hashPassword (password) {
    logger.info('Auth.hashPassword')

    try {
      let userPassword = Buffer.from(password)
      return await pwd.hashAsync(userPassword)
    } catch (e) {
      logger.error('Auth.hashPassword', {error: e})
      throw e
    }
  }

  async validatePassword (hash, password) {
    logger.info('Auth.validatePassword')

    let validated = false
    try {
      let passwordBuf = Buffer.from(password)
      let hashBuf = Buffer.from(hash)
      let result = await pwd.verifyAsync(passwordBuf, hashBuf)
      if (result !== securePassword.INVALID && result !== securePassword.INVALID_UNRECOGNIZED_HASH) {
        validated = true
        hash = null
        if (result === securePassword.VALID_NEEDS_REHASH) {
          hash = await this.hashPassword(password)
        }
      }
    } catch (err) {
      logger.error('Auth.validatePassword', {error: err})
      validated = false
    }
    return {
      validated: validated,
      hash: hash
    }
  }
}

module.exports = new Auth()
