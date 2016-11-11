const chai = require('chai'); 
const assert = chai.assert;

const User = require('../lib/models/user'); 

describe('User model tests', () => {
  it('fails without username, password', done => {    
    const user = new User({
      roles: 'impresario'
    });

    user.validate(err => {
      assert.isOk(err, 'username is required');
      assert.isOk(err, 'password is required');
      done();
    });
  });

  it('produces reliable hash value from password', () => {
    const user = new User({
      username: 'Genji Monogatari',
      password: 'Shikibu',
      roles: ['impresario']
    });

    user.generateHash('Shikibu');      

    assert.isOk(user.compareHash('Shikibu'));

  });

});

