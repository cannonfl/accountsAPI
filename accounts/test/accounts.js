const Promise = require('bluebird')
let chai = require('chai')
let chaiHttp = require('chai-http')
let Accounts = require('../Accounts')
let should = chai.should()
const logger = require('../../logger/logger')

chai.use(chaiHttp)

class AuthMock {
  async hashPassword (password) {
    return Promise.resolve(password)
  }
  async validatePassword (account, password) {
    return Promise.resolve({ 
      validated: true
    })
  }
}
let authMock = new AuthMock()

class AccountsDaoMock {
  async insert (account) {
    return Promise.resolve({
      success: true
    })
  }
  async update (account) {
    return Promise.resolve({
      success: true
    })
  }
  async find (userName) {
    return Promise.resolve({
      success: true,
      account: {
        userName: 'userName',
        type: 'type',
        fname: 'fname',
        lname: 'lname',
        phone: 'phone',
        email: 'email',
        contactPref: 'contactPref'
      }
    })
  }
  async delete(userName) {
    return Promise.resolve({
      success: true
    })
  }
}
let accounts = new Accounts(AccountsDaoMock, authMock)

describe('Accounts', () => {
  beforeEach((done) => {
    logger.transports['console.info'].silent = true
    done()
  })
  afterEach((done) => {
    logger.transports['console.info'].silent = false
    done()
  })

  describe('Create account', () => {
    it('it should return success', async () => {
      let req = {
        headers: [{
          username: 'mockUser',
          password: 'mockPassword'
        }],
        body: {
          type: 'type',
          userName: 'userName',
          password: 'password',
          fname: 'fname',
          lname: 'lname',
          phone: 'phone',
          email: 'email',
          contactPref: 'contactPref'
        }
      }
      let res = {
        status: (statusCode) => {
          statusCode.should.equal(200)
        },
        setHeader: (type, param) => {
          
        },
        json: (params) => {
          
        }
      }
      await accounts.create (req, res)
    })
  })

  describe('Login account', () => {
    it('it should return success', async () => {
      let req = {
        headers: [{
          username: 'mockUser'
        }],
        body: {
          type: 'type',
          userName: 'userName',
          password: 'password',
          fname: 'fname',
          lname: 'lname',
          phone: 'phone',
          email: 'email',
          contactPref: 'contactPref'
        }
      }
      let res = {
        status: (statusCode) => {
          statusCode.should.equal(200)
        },
        setHeader: (type, param) => {
          
        },
        json: (params) => {
          
        }
      }
      await accounts.create (req, res)
    })
  })

  describe('Find account', () => {
    it('it should return success', async () => {
      let req = {
        params: {
          userName: 'userName'
        }
      }
      let res = {
        status: (statusCode) => {
          statusCode.should.equal(200)
        },
        setHeader: (type, param) => {
          
        },
        json: (params) => {
          
        }
      }
      await accounts.find (req, res)
    })
  })

  describe('Update account', () => {
    it('it should return success', async () => {
      let req = {
        headers: [],
        params: {
          userName: 'userName'
        },
        body: {
          type: 'type',
          userName: 'userName',
          password: 'password',
          fname: 'fname',
          lname: 'lname',
          phone: 'phone',
          email: 'email',
          contactPref: 'contactPref'
        }
      }
      let res = {
        status: (statusCode) => {
          statusCode.should.equal(200)
        },
        setHeader: (type, param) => {
          
        },
        json: (params) => {
          
        }
      }
      await accounts.update (req, res)
    })
  })


  describe('Delete account', () => {
    it('it should return success', async () => {
      let req = {
        params: {
          userName: 'userName'
        }
      }
      let res = {
        status: (statusCode) => {
          statusCode.should.equal(200)
        },
        setHeader: (type, param) => {
          
        },
        json: (params) => {
          
        }
      }
      await accounts.delete (req, res)
    })
  })

  delete(userName)

})
