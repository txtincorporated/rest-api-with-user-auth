const http = require('http');

const app = require('./lib/app');
const port = process.env.PORT || 3000;
require('./lib/setup-mongoose');

http.createServer(app).listen(port);  
