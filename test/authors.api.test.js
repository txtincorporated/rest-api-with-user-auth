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
    // done();
  });

  // before(done => {
  //   const CONNECTED = 1;
  //   if(connection.readyState === CONNECTED) dropCollection();
  //   else(connection.on('open', dropCollection));

  //   function dropCollection() {
  //     const name = 'authors';
  //     connection.db
  //       .listCollections({name})
  //       .next((err, collinfo) => {
  //         if(!collinfo) return done();
  //         connection.db.dropCollection(name, done);
  //       });
  //   };
  // });

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
    console.log('User token: ', token);    
    request 
      .post('/api/authors')
      .set('authorization', 'Bearer ' + token)
      .send(trout)
      .then(res => {
        authResult = res.body;
        console.log('authResult POST: ', authResult);
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
        console.log('authResult GET', authResult);
        console.log('trout GET: ', trout);
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
        console.log('authResult PUT1', authResult);
        console.log('sturgeon1', sturgeon);
        authResult = res.body;
        console.log('authResult PUT2', authResult);
        sturgeon.__v = 0;
        sturgeon._id = authResult._id;
        console.log('sturgeon2', sturgeon);
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