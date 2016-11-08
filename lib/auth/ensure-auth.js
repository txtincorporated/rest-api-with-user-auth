const tokenator = require('./token');

module.exports = function getEnsureAuth() {

  return function ensureAuth(req, res, next) {
    console.log('Start ensureAuth... ');
    //check auth. header for token
    //NOTE that Express lowercases all headers
    const authHeader = req.headers.authorization;

    //error if no token
    if(!authHeader) {
      return next({
        code: 400,
        error: 'unauthorized:  missing token'
      });
    }

    //Auth header in 'Bearer <token>' form
    //note cool shorthanding -- three lines for the price of one!
    const [bearer, jwt] = authHeader.split(' ');

    //validate intro word and well-formed jwt
    if(bearer !=='Bearer' || !jwt) {
      return next({
        code: 400,
        error: 'unauthorized: invalid token'
      });
    }

    //if proper jwt then verify
    console.log('calling tokenator... ');
    tokenator.verify(jwt)
      .then(payload => {
        req.user = payload;
        next();
      })
      .catch(err => {
        return next({
          code: 403,
          error: 'unauthorized:  invalid token',
          err: err
        });
      });

  };
};