const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
chai.use(chaiHttp);

//start the db, and store connection,
//so we can clear db
const connection = require('../lib/setup-mongoose');

const app = require('../lib/app');

//SET UP MONGOOSE CONNECTION
describe('test books resource route', () => {

  before(done => {  
    const CONNECTED = 1;
    if (connection.readyState === CONNECTED) dropCollection();
    else (connection.on('open', dropCollection));

    function dropCollection() {
      const name = 'books';
      connection.db
        .listCollections({name})
        .next((err, collinfo) => {
          if (!collinfo) return done();
          connection.db.dropCollection(name, done);
        });
    };
  });

  const request = chai.request(app);

  const twain = {
    name: 'Mark Twain',
    centuries: ['19th'],
    altnames: [],
    books: []
  };
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
    console.log('Test books GET all -- before...');
    request
      .get('/api/books')
      .then(res => {
        assert.deepEqual(res.body, []);
        done();
      })
      .catch(done);
  });

  it('/POST (author)', done => {
    request 
      .post('/api/authors')
      .send(twain)
      .then(res => {
        authResult = res.body;
        console.log('authResult POST: ', authResult);
        twain.__v = 0;
        twain._id = authResult._id;
        sawyer.authId = twain._id;
        clemens.authId = twain._id;
        done();
      })
      .catch(done);
  });
  
  it('/POST', done => {
    console.log('Test books POST...');
    request
    .post('/api/books')
    .send(sawyer)
    .then(res => {
      bookResult = res.body;
      console.log('bookResult POST: ', bookResult);
      sawyer.__v = 0;
      sawyer._id = bookResult._id;
      // sawyer.authId = authResult._id;
      console.log('sawyer2: ', sawyer);
      assert.deepEqual(bookResult, sawyer);
      done();
    })
  .catch(done) ;
  });

  it('/GET/:id', done => {
    console.log('Test books GET/:id...');
    sawyer.authId = { _id: `${twain._id}`, name: 'Mark Twain' };
    request
      .get(`/api/books/${sawyer._id}`)
      // .query({_id:sawyer._id})
      .then(res => {
        console.log('sawyer GET: ', sawyer);
        bookResult = res.body;
        console.log('bookResult GET', bookResult);
        assert.deepEqual([bookResult], [sawyer]);
        done();
      })
      .catch(done);
  });

  it('/PUT/:id', done => {
    console.log('Test books PUT/:id...');
    request
      .put(`/api/books/${sawyer._id}`)
      // .query({_id:sawyer._id})
      .send(clemens)      
      .then(res => {
        console.log('bookResult PUT1', bookResult);
        console.log('clemens1: ', clemens);
        bookResult = res.body;
        console.log('bookResult PUT2', bookResult);
        clemens.__v = 0;
        clemens._id = bookResult._id;
        console.log('clemens2: ', clemens);
        assert.deepEqual(bookResult, clemens);
        done();
      })
      .catch(done);
  });

  it('GET all -- after', done => {
    console.log('Test books GET all -- after...');
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
    console.log('Test books DELETE...');
    request
      .delete('/api/books')
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


// //TEST AUTHORS RESOURCE ROUTE
// describe('test authors resource route', () => {

//   const request = chai.request(app);

//   const trout = {
//     name: 'Kilgore Trout',
//     centuries: '20th',
//     altname: 'Theodore Sturgeon'
//   };
//   const sturgeon = {
//     name: 'Kilgore Trout',
//     centuries: '20th',
//     altname: ''
//   };

//   var authResult = null;


//   it('GET all -- before', done => {
//     request
//       .get('/api/authors')
//       .then(res => {
//         assert.deepEqual(res.body, []);
//         done();
//       })
//       .catch(done);
//   });

//   it('/POST', done => {
//     request 
//       .post('/api/authors')
//       .send(trout)
//       .then(res => {
//         authResult = res.body;
//         console.log('authResult POST: ', authResult);
//         trout.__v = 0;
//         trout._id = authResult._id;
//         assert.deepEqual(authResult, trout);
//         done();
//       })
//       .catch(done);
//   });

//   it('/GET/:id', done => {
//     request
//       .get('/api/authors')
//       .query({_id:trout._id})
//       .then(res => {
//         console.log('authResult GET', authResult);
//         console.log('trout GET: ', trout);
//         authResult = res.body;
//         assert.deepEqual(authResult, [trout]);
//         done();
//       })
//       .catch(done);
//   });

//   it('/PUT/:id', done => {
//     request
//       .put(`/api/authors/${trout._id}`)
//       .send(sturgeon)
//       .then(res => {
//         console.log('authResult PUT1', authResult);
//         console.log('sturgeon1', sturgeon);
//         authResult = res.body;
//         console.log('authResult PUT2', authResult);
//         sturgeon.__v = 0;
//         sturgeon._id = authResult._id;
//         console.log('sturgeon2', sturgeon)
//         assert.deepEqual(authResult, sturgeon);
//         done();
//       })
//       .catch(done);
//   });

//   it('GET all -- after', done => {
//     request
//       .get('/api/authors')
//       .then(res => {
//         assert.deepEqual(res.body, [sturgeon]);
//         done();
//       })
//       .catch(done);
//   });

//   it('DELETE /:id', done => {
//     request
//       .delete('/api/authors')
//       .query({_id:trout._id})
//       .then(res => {
//         authResult = res.body;
//         assert.deepEqual(authResult, {});
//         done();
//       })
//       .catch(done);
//   });

// });
