const express = require('express');
const app = express();
const morgan = require('morgan');

const errorHandler = require('./error-handler');
// const ensureAuth = require('./auth/ensure-auth')();
const notFound = require('./not-found');
const favicon = require('./favicon');

const auth = require('./routes/auth');
const books = require('./routes/books');
const authors = require('./routes/authors');

//log http requests
app.use(morgan('dev'));

app.get('/favicon.ico', favicon);

app.use('/api/auth', auth);
app.use('/api/books', books);
app.use('/api/authors', authors);

app.use('*', notFound);

app.use(errorHandler);

module.exports = app;
