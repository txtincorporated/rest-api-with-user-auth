const favicon = function(req, res) { 
  const favicon = fs.createReadStream('favicon.ico');
  favicon.pipe(res);
};

module.exports = favicon;
