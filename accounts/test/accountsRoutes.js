const Promise = require('bluebird')
let chai = require('chai')
let chaiHttp = require('chai-http')
let Server = require('../../Server')
let should = chai.should()
const logger = require('../../logger/logger')

chai.use(chaiHttp)

let responder = res => {
  res.status(200)
  res.setHeader('Content-Type', 'application/json')
  res.json({test: 'test'})
  return Promise.resolve()
}

class AccountsMock {
  async create (req, res) {
    return responder(res)
  }
  async find (req, res) {
    return responder(res)
  }
  async login (req, res) {
    return responder(res)
  }
  async update (req, res) {
    return responder(res)
  }
  async delete (req, res) {
    return responder(res)
  }
}
let server = new Server(AccountsMock).app

describe('Routes', () => {
  beforeEach((done) => {
    logger.transports['console.info'].silent = true
    done()
  })
  afterEach((done) => {
    logger.transports['console.info'].silent = false
    done()
  })

  describe('Create account endpoint', () => {
    it('it should exist', (done) => {
      chai.request(server)
      .post('/v1/accounts/create')
      .set('test', 'test')
      .end((err, res) => {
        res.status.should.not.equal(404)
        done()
      })
    })
  })

  describe('Login account endpoint', () => {
    it('it should exist', (done) => {
      chai.request(server)
      .post('/v1/accounts/testUser/login')
      .set('test', 'test')
      .end((err, res) => {
        res.status.should.not.equal(404)
        done()
      })
    })
  })

  describe('Get account endpoint', () => {
    it('it should exist', (done) => {
      chai.request(server)
      .get('/v1/accounts/testUser')
      .set('test', 'test')
      .end((err, res) => {
        res.status.should.not.equal(404)
        done()
      })
    })
  })

  describe('Update account endpoint', () => {
    it('it should exist', (done) => {
      chai.request(server)
      .put('/v1/accounts/testUser')
      .set('test', 'test')
      .end((err, res) => {
        res.status.should.not.equal(404)
        done()
      })
    })
  })

  describe('Delete account endpoint', () => {
    it('it should exist', (done) => {
      chai.request(server)
      .delete('/v1/accounts/testUser')
      .set('test', 'test')
      .end((err, res) => {
        res.status.should.not.equal(404)
        done()
      })
    })
  })
})
