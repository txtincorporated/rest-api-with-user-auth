const http = require('http');
require('dotenv').config();

const app = require('./lib/app');
const port = process.env.PORT;
require('./lib/setup-mongoose');

http.createServer(app).listen(port);  
