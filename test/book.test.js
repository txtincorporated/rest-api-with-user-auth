const chai = require('chai'); 
const assert = chai.assert;

const Book = require('../lib/models/book'); 

describe('Book model tests', () => {
  it('fails without author, title, authId', done => {    
    const book = new Book({
      genres: ['novel']
    });

    book.validate(err => {
      assert.isOk(err, 'author is required');
      assert.isOk(err, 'title is required');
      assert.isOk(err, 'authId is required');
      done();
    });
  });

  it('supplies default value for genres', done => {
    const book = new Book({
      title: 'Genji Monogatari',
      author: 'Murasaki Shikibu',
      authId: ''
    });

    book.validate(() => {
      assert.isOk(book.genres);
      done();
    });

  });

});