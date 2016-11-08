const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser').json();

const ensureAuth = require('../auth/ensure-auth')();
const ensureRole = require('../auth/ensure-role');

const Author = require('../models/author');
const Book = require('../models/book');

router
    .get('/', (req, res, next) => {
      console.log('Author GET route... ');
      const query = {};

      // support sending a nav bar query using `?`
      if(req.query.name) query.name = req.query.name;
      if(req.query.centuries) query.centuries = req.query.centuries;
      // if(req.query._id) query._id = req.query._id;

      Author.find(query)
        .then(authors => res.send(authors))
        .catch((err) => {
          console.log('Author error (GET) ', err);
          next(err);
        });
    })
    .get('/:id', (req, res, next) => {

      const authId = req.params.id;
      Promise
        .all([

          Author
            .findById(authId)
            .lean(),

          Book
            .find({authId})
            .select('title genres')
            .lean()

        ])
        .then(([author, books]) => {
          author.books = books;
          console.log('Books are...', books);
          res.send(author);
        })
        .catch(next);

    })
    .post('/', ensureAuth, ensureRole('admin', 'super-user'), bodyParser, (req, res, next) => {
      console.log('Calling authors.post... ');

      new Author(req.body).save()
        .then(author => res.send(author))
        .catch((err) => {
          console.log('Author error (POST):  ', err);
          next(err);
        });
    })
    .put('/:id', ensureAuth, ensureRole('admin', 'super-user'), bodyParser, (req, res, next) => {
      console.log('Calling authors.put...');
      console.log(req.params.id);
      Author.findByIdAndUpdate(req.params.id, req.body, {new: true})
        .then(saved => res.send(saved))
        .catch(next);
    })
    .delete('/:id', ensureAuth, ensureRole('super-user'), (req, res, next) => {
      console.log('Calling authors.del...');
      Author.findByIdAndRemove(req.params.id)
        .then(deleted => res.send(deleted))
        .catch(next);
    });

module.exports = router;
