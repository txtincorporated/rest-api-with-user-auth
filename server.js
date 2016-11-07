const http = require('http');

const app = require('./lib/app');
require('./lib/setup-mongoose');

http.createServer(app).listen(3000);