'use strict'

const Promise = require('bluebird')
const config = require('config')
const mysql = require('mysql')
const logger = require('../logger/logger')

class AccountsDao {
  constructor () {
    let dbConfig = config.get('ujob.dbConfig')
    this.connection = mysql.createConnection(dbConfig)
    this.connection.connect((e) => {
      if (e) {
        logger.error('create', {error: e})
        throw e
      }
    })
  }

  async insert (account) {
    logger.info('AccountsDao.insert', { userName: account.userName })

    return new Promise((resolve, reject) => {
      let sql = 'INSERT INTO account (userName, type, password, fname, lname, phone, email, contactPref, active) values ?'
      let Values = [
        [
          account.userName,
          account.type,
          account.password,
          account.fname,
          account.lname,
          account.phone,
          account.email,
          account.contactPref,
          false
        ]
      ]
      this.connection.query(sql, [Values], (err, result) => {
        if (err) {
          logger.error('AccountsDao.insert', { error: err })
          reject(err.code)
        } else {
          logger.info('AccountsDao.insert', {rowsInserted: result.affectedRows})
          resolve({
            success: true
          })
        }
      })
    })
  }

  async update (account) {
    logger.info('AccountsDao.update', { userName: account.userName })

    return new Promise((resolve, reject) => {
      let sql = 'UPDATE account SET \
          password = COALESCE(?,password), \
          fname = COALESCE(?,fname), \
          lname = COALESCE(?,lname), \
          phone = COALESCE(?,phone), \
          email = COALESCE(?,email), \
          contactPref = COALESCE(?,contactPref) \
          WHERE userName = ?'
      let values = [
        account.password,
        account.fname,
        account.lname,
        account.phone,
        account.email,
        account.contactPref,
        account.userName
      ]

      this.connection.query(sql, values, (err, result) => {
        if (err) {
          logger.error('AccountsDao.update', { error: err })
          reject(err.code)
        } else {
          logger.info('AccountsDao.update', {rowsInserted: result.affectedRows})
          resolve({
            success: true
          })
        }
      })
    })
  }

  async upsert (account) {
    logger.info('AccountsDao.upsert', { userName: account.userName })

    return new Promise((resolve, reject) => {
      let sql = 'INSERT INTO account (userName, type, password, fname, lname, phone, email, contactPref, active) values ? \
                ON DUPLICATE KEY UPDATE \
                fname = values(fname), lname = values(lname), phone = values(phone), \
                email = values(email), contactPref = values(contactPref)'
      let Values = [
        [
          account.userName,
          account.type,
          account.password,
          account.fname,
          account.lname,
          account.phone,
          account.email,
          account.contactPref,
          false
        ]
      ]
      this.connection.query(sql, [Values], (err, result) => {
        if (err) {
          logger.error('AccountsDao.upsert', { error: err })
          reject(err.code)
        } else {
          logger.info('AccountsDao.upsert', {rowsInserted: result.affectedRows})
          resolve({
            success: true
          })
        }
      })
    })
  }

  async find (userName) {
    logger.info('AccountsDao.find', { userName: userName })

    return new Promise((resolve, reject) => {
      let sql = 'SELECT password, type, userName, fname, lname, phone, email, contactPref FROM account WHERE userName = ?'
      let values = [userName]
      this.connection.query(sql, [values], (err, result) => {
        if (err) {
          logger.error('AccountsDao.find', { error: err })
          reject(err.code)
        } else {
          logger.info('AccountsDao.find - Account found', { userName: userName })
          if (result.length > 0) {
            resolve({
              success: true,
              account: result[0]
            })
          } else {
            resolve({
              success: false
            })
          }
        }
      })
    })
  }

  async delete (userName) {
    logger.info('AccountsDao.delete', { userName: userName })

    return new Promise((resolve, reject) => {
      let sql = 'DELETE FROM account WHERE userName = ?'
      let values = [userName]
      this.connection.query(sql, [values], (err, result) => {
        if (err) {
          logger.error('AccountsDao.delete', { error: err })
          reject(err.code)
        } else {
          if (result.affectedRows === 0) {
            logger.warn('AccountsDao.delete - No records deleted', { userName: userName })
            resolve({
              success: false
            })
          } else {
            logger.info('AccountsDao.delete - Account deleted', { userName: userName })
            resolve({
              success: true
            })
          }
        }
      })
    })
  }
}

module.exports = AccountsDao
