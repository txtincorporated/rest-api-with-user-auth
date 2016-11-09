module.exports = function errorHandler(err, req, res, next) {// eslint-disable-line no-unused-var
  console.log(req.url);
  const code = err.code || 500;
  const error = code === 500 ? 'Internal Server Error' : err.error;    
  console.log('We are in error handler.js now.');
  console.log(err.error || err.message);
  res.status(code).send({error});
 
};