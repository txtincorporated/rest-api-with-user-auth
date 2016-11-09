// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const assert = chai.assert;
// chai.use(chaiHttp);

// const connection = require('../lib/setup-mongoose');

// const app = require('../lib/app');

// describe('Test authors resource route', () => {

//   before(done => {
//     const CONNECTED = 1;
//     if(connection.readyState === CONNECTED) dropCollection();
//     else(connection.on('open', dropCollection));

//     function dropCollection() {
//       const name = 'authors';
//       connection.db
//         .listCollections({name})
//         .next((err, collinfo) => {
//           if(!collinfo) return done();
//           connection.db.dropCollection(name, done);
//         });
//     };
//   });

//   const request = chai.request(app);

//   const trout = {
//     name: 'Kilgore Trout',
//     centuries: ['20th'],
//     altnames: ['Theodore Sturgeon'],
//     books: []
//   };
//   const sturgeon = {
//     name: 'Kilgore Trout',
//     centuries: ['20th'],
//     altnames: [''],
//     books: []
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