module.exports = function(req, res) {
  console.log('UNAUTHORIZED');
  res.send('404 Not Found. Please visit localhost:3000/books for a list of available works, or localhost:3000/authors for the list of authors.');
};


