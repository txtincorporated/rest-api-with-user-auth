const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);
// //If setting test-specific .env variables here...
// const path = require('path');
// require('dotenv').load({path: path.join(__dirname, '.env.test')});

const connection = require('../lib/setup-mongoose');
const app = require('../lib/app');

describe('Test authorization routes...', () => {
  // //If setting .env variables within file, safe to drop whole db in `before`
  // before(done => {
  //   const drop = () => connection.db.dropDatabase(done);
  //   if(connection.readyState === 1) drop();
  //   else connection.on('open' ,drop);
  // });
  //If setting test .env vars in `package.json`, better to just drop specific collection
  before(done => {
    const CONNECTED = 1;
    if(connection.readyState === CONNECTED) dropCollection();
    else(connection.on('open', dropCollection));

    function dropCollection() {
      const name = 'users';
      connection.db
        .listCollections({name})
        .next((err, collinfo) => {
          if(!collinfo) return done();
          connection.db.dropCollection(name, done);
        });
    };
  });
  const request = chai.request(app);
  const trout = {
    name: 'Kilgore Trout',
    centuries: ['20th'],
    altnames: ['Theodore Sturgeon'],
    books: []
  };


  describe('Test unauthorized request... ', () => {

    it('returns 400 error without token', done => {
      console.log('starting 400 no token...');
      request
        .post('/api/authors/')
        .send(trout)
        .then(res => {
          done('status should not be 200');
        })
        .catch(res => {
          assert.equal(res.status, 400);
          assert.equal(res.response.body.error, 'unauthorized:  missing token');
          done();
        })
        .catch(done);
    });

    it('returns 403 with invalid token', done => {
      request
        .post('/api/authors')
        .set('Authorization', 'Bearer badtoken')
        .send(trout)
        .then(res => done('status should not be 200'))
        .catch(res => {
          assert.equal(res.status, 403);
          assert.equal(res.response.body.error, 'unauthorized:  invalid token');
          done();
        })
        .catch(done);
    });

  });

  const user = {
    username: 'test user',
    password: 'testpassword', 
    roles: ['user', 'admin', 'super-user']
  };

  describe('Test user management functions... ', () => {

    function badRequest(url, send, error, done) {
      request
        .post(url)
        .send(send)
        .then(res => done('status should not be 200'))
        .catch(res => {
          assert.equal(res.status, 400);
          assert.equal(res.response.body.error, error);
          done();
        })
        .catch(done);
    }

    it('requires username for signup', done => {
      badRequest('/api/auth/signup', {password: 'abc'}, 'username and password required', done);
    });

    it('requires password for signup', done => {
      badRequest('/api/auth/signup', {username: 'abc'}, 'username and password required', done);
    });

    let token = '';

    it('yields valid token on proper signup', done => {
      console.log('Start valid token test... ');
      request
        .post('/api/auth/signup')
        .send(user)
        .then(res => assert.isOk(token = res.body.token))
        .catch(done);
      done();
    });

    it('quashes duplicate usernames', done => {
      badRequest('/api/auth/signup', user, 'username test user already exists', done);
    });

    it('issues valid token on signin', done => {
      request 
        .post('/api/auth/signin')
        .send(user)
        .then(res => {
          assert.equal(res.body.token, token);
        })
        .then(done);
      done();
    });

    it('accepts valid token on requiring routes', done => {
      // console.log('Token:  ', token);
      request
        .post('/api/authors')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          assert.equal(res.status, 200);
        })
        .catch(done);
      done();
    });

  });

});