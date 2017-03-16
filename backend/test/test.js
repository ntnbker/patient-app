process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let faker = require('faker');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

let agent = chai.request.agent(server);

describe('User Controller', () => {
  beforeEach((done) => {
      done();    
  });
  describe('/POST auth/local', () => {
      it('it should Sign In successful', (done) => {
            let account = {
              username: 'admin',
              password: 'admin'
            }
            chai.request(server)
            .post('/auth/local')
            .send(account)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
              done();
            });
      });
      it('it should not Sign In with account wrong', (done) => {
            let account = {
              username: '123123',
              password: 'hahaha'
            }
            chai.request(server)
            .post('/auth/local')
            .send({
              account
            })
            .end((err, res) => {
                res.should.have.status(400);
              done();
            });
      });
  });
  describe('/POST signup', () => {
      it('it should POST sign up new account', (done) => {
        let user = {
            username: faker.name.firstName(),
            password: 'test'
        }
            chai.request(server)
            .post('/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
              done();
            });
      });
      it('it should not POST sign up with empty field ', (done) => {
        let user = {
            username: faker.name.firstName()
        }
            chai.request(server)
            .post('/signup')
            .send(user)
            .end((err, res) => {
                res.should.have.status(401);
              done();
            });
      });
  });
});

describe('Patient Controller', () => {
  beforeEach((done) => {
      done();
  });
  describe('/GET v1/userinfo', () => {
    it('it should GET successful with my profile', (done) => {
          let account = {
            username: 'ntnbker',
            password: 'ntnbker'
          }
          chai.request(server)
          .post('/auth/local')
          .send(account)
          .end((err, res) => {
              return chai.request(server)
                      .get('/v1/userinfo')
                      .set('cookie', res.header['set-cookie'])
                      .end((err, res) => {
                        expect(res).to.have.status(200);
                        done();
                      })

          });
    });
  })
  describe('/GET v1/patient/:id', () => {
    it('it should GET successful from outside', (done) => {
          chai.request(server)
          .get('/v1/patient/58c902073a6f0c0400fd79bb')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
            done();
          });
    });
  });
  describe('/PUT v1/patient/:id', () => {
    it('it should PUT successful with my profile', (done) => {
      let account = {
        username: 'ntnbker',
        password: 'ntnbker'
      }
      chai.request(server)
      .post('/auth/local')
      .send(account)
      .end((err, res) => {
          return agent
                  .put('/v1/patient/' + res.body.information_id)
                  .send({
                    updates: {
                      'name': faker.name.firstName()
                    }
                  })
                  .set('cookie', res.header['set-cookie'])
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                  })

      });
    });
  });
  describe('/PUT v1/patient/:id', () => {
    it('it should PUT successful with admin user', (done) => {
      let account = {
        username: 'admin',
        password: 'admin'
      }
      chai.request(server)
      .post('/auth/local')
      .send(account)
      .end((err, res) => {
          return agent
                  .put('/v1/patient/58c902073a6f0c0400fd79bb')
                  .send({
                    updates: {
                      'name': faker.name.firstName()
                    }
                  })
                  .set('cookie', res.header['set-cookie'])
                  .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                  })

      });
    });
  });
  describe('/GET v1/patients', () => {
    it('it should GET successful with list of patients', (done) => {
      chai.request(server)
      .get('/v1/patients')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
    });
  });
});
