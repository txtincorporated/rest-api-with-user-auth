const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser').json();
const ensureAuth = require('../auth/ensure-auth')();

const User = require('../models/user');
const token = require('../auth/token');

//validate token
router
  .post('/validate', ensureAuth, (req, res, next) => {
    res.send({valid: true});
  });

router
  .post('/signup', bodyParser, (req, res, next) => {
  //user and pass sent as props on req.body
    const {username, password} = req.body;
    console.log('in /signup post handler: req.body:  ', req.body);
    //housekeeping: passwd no longer needed on body so remove
    delete req.body.password;

    if(!username || !password) {
      return next({
        code: 400,
        error: 'username and password required'
      });
    }

  //check for duplicate user name
    User.find({username})// same as {username: username}
      .count()
      .then(count => {
        //look for dupes
        if (count > 0) throw {code: 400, error: `username ${username} already exists`}

        //create user obj, hash passwd and save
        const user = new User(req.body);
        user.generateHash(password);
        return user.save();
      })
      //create token for subsequent requests
      .then(user => token.sign(user))
      .then(token => res.send({token}))
      .catch(next);

  });

router.post('/signin', bodyParser, (req, res, next) => {
  //user & pass in req.body
  const {username, password} = req.body;
  //housekeeping:  remove pass from body since no longer needed 
  delete req.body.password;

  //find by username 
  User.findOne({username})
    .then(user => {
      //validate user and pass combo
      if(!user || !user.compareHash(password)) {
        throw {code: 400, error: 'invalid username or password'};
      }

      //create token for followon reqs
      return token.sign(user);
    })
    //send token in res
    .then(token => res.send({token}))
    .catch(next);

});

module.exports = router;
