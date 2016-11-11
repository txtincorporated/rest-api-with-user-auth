const chai = require('chai'); 
const assert = chai.assert;

const Author = require('../lib/models/author'); 

describe('Author model tests', () => {
  it('validates with author and centuries', done => {    
    const author = new Author({
      name: 'name',
      centuries: ['centuries']
    });

    author.validate(err => {
      if(!err) done();
      else done(err);
    });
  });

  it('requires name field', done => {
    const author = new Author();
    author.centuries = ['centuries'];

    author.validate(err => {
      assert.isOk(err, 'name is required');
      done();
    });
  });

  it('adds default centuries array', done => {
    const author = new Author({
      name: 'Bob Dylan',
    });

    author.validate(() => {
      console.log('Centuries: ', author.centuries);
      assert.isOk(author.centuries);
      done();
    });
  });
});