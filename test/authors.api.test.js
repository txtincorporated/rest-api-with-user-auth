const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

if(!process.env.TRAVIS) {
  require('dotenv').config();
}

const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

describe('Test authors resource route', () => {
  //CAUTION:  NUCLEAR OPTION
  //If setting test-specific .env variables, safe to drop whole db in `before`
  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if(connection.readyState === 1) drop(done);
    else connection.on('open', drop);
  });

  const request = chai.request(app);

  const trout = {
    name: 'Kilgore Trout',
    centuries: ['20th'],
    altnames: ['Theodore Sturgeon'],
    books: []
  };
  const sturgeon = {
    name: 'Kilgore Trout',
    centuries: ['20th'],
    altnames: [''],
    books: []
  };

  var authResult = null;

  const user = {
    username: 'test user',
    password: 'testpassword', 
    roles: ['user', 'admin', 'super-user']
  };

  let token = null;

  it('Sets up user login and roles', done => {
    request
      .post('/api/auth/signup')
      .send(user)
      .then(res => assert.isOk(token = res.body.token))
      .catch(done);
    done();
  });

  it('GET all -- before', done => {
    request
      .get('/api/authors')
      .then(res => {
        assert.deepEqual(res.body, []);
        done();
      })
      .catch(done);
  });

  it('/POST', done => {
    request 
      .post('/api/authors')
      .set('authorization', 'Bearer ' + token)
      .send(trout)
      .then(res => {
        authResult = res.body;
        trout.__v = 0;
        trout._id = authResult._id;
        assert.deepEqual(authResult, trout);
        done();
      })
      .catch(done);
  });

  it('/GET/:id', done => {
    request
      .get('/api/authors')
      .query({_id:trout._id})
      .then(res => {
        authResult = res.body;
        assert.deepEqual(authResult, [trout]);
        done();
      })
      .catch(done);
  });

  it('/PUT/:id', done => {
    request
      .put(`/api/authors/${trout._id}`)
      .set('authorization', 'Bearer ' + token)
      .send(sturgeon)
      .then(res => {
        authResult = res.body;
        sturgeon.__v = 0;
        sturgeon._id = authResult._id;
        assert.deepEqual(authResult, sturgeon);
        done();
      })
      .catch(done);
  });

  it('GET all -- after', done => {
    request
      .get('/api/authors')
      .then(res => {
        assert.deepEqual(res.body, [sturgeon]);
        done();
      })
      .catch(done);
  });

  it('DELETE /:id', done => {
    request
      .delete('/api/authors')
      .set('authorization', 'Bearer ' + token)
      .query({_id:trout._id})
      .then(res => {
        authResult = res.body;
        assert.deepEqual(authResult, {});
        done();
      })
      .catch(done);
  });

});