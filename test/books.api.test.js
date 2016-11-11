const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

if(!process.env.TRAVIS) {
  require('dotenv').config();
}
//start the db, and store connection,
//so we can clear db
const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

//SET UP MONGOOSE CONNECTION
describe('test books resource route', () => {
  //CAUTION:  NUCLEAR OPTION
  //If setting test-specific .env variables, safe to drop whole db in `before`
  before(done => {
    const drop = () => connection.db.dropDatabase(done);
    if(connection.readyState === 1) drop(done);
    else connection.on('open', drop);
  });

  const request = chai.request(app);

  //Set up user for protected routes
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

  //Set up parent resource for required child links in Book documents
  const twain = {
    name: 'Mark Twain',
    centuries: ['19th'],
    altnames: [],
    books: []
  };

  //Set up book data to post and put; authId will be reset with author _id set by Mongo upon recpt
  const sawyer = {
    title: 'Tom Sawyer',
    author: 'Mark Twain',
    authId: '582033d6f7e5f639eb20788d',
    genres: []
  }; 
  const clemens = {
    title: 'Tom Sawyer',
    author: 'Samuel Clemens',
    authId: '582033d6f7e5f639eb20788d',
    genres: []
  };

  var bookResult = null;


  it('/GET all -- before', done => {
    request
      .get('/api/books')
      .then(res => {
        assert.deepEqual(res.body, []);
        done();
      })
      .catch(done);
  });

  //Post parent document for book
  it('/POST (author)', done => {
    request 
      .post('/api/authors')
      .set('authorization', 'Bearer ' + token)
      .send(twain)
      .then(res => {
        authResult = res.body;
        twain.__v = 0;
        twain._id = authResult._id;
        sawyer.authId = twain._id;
        clemens.authId = twain._id;
        done();
      })
      .catch(done);
  });
  
  it('/POST', done => {
    request
    .post('/api/books')
    .set('authorization', 'Bearer ' + token)
    .send(sawyer)
    .then(res => {
      bookResult = res.body;
      sawyer.__v = 0;
      sawyer._id = bookResult._id;
      assert.deepEqual(bookResult, sawyer);
      done();
    })
  .catch(done) ;
  });

  it('/GET/:id', done => {
    sawyer.authId = { _id: `${twain._id}`, name: 'Mark Twain' };
    request
      .get(`/api/books/${sawyer._id}`)
      .then(res => {
        bookResult = res.body;
        assert.deepEqual([bookResult], [sawyer]);
        done();
      })
      .catch(done);
  });

  it('/PUT/:id', done => {
    request
      .put(`/api/books/${sawyer._id}`)
      .set('authorization', 'Bearer ' + token)
      .send(clemens)      
      .then(res => {
        bookResult = res.body;
        clemens.__v = 0;
        clemens._id = bookResult._id;
        assert.deepEqual(bookResult, clemens);
        done();
      })
      .catch(done);
  });

  it('GET all -- after', done => {
    clemens.authId = { _id: `${twain._id}`, name: 'Mark Twain' };

    request
      .get('/api/books')
      .then(res => {
        assert.deepEqual(res.body, [clemens]);
        done();
      })
      .catch(done);
  });

  it('DELETE /:id', done => {
    request
      .delete('/api/books')
      .set('authorization', 'Bearer ' + token)
      .query({_id:sawyer._id})      
      .then(res => {
        bookResult = res.body;
        assert.deepEqual(bookResult, {});
        done();
      })
      .catch(done);
  });

  after( done => {
    connection.close( done );
  });  

});

