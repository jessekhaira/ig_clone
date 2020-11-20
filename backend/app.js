var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./routes/users');
var helmet = require('helmet');
var compression = require('compression'); 
var app = express();
app.use(express.static(path.join(__dirname, '../client/build')));
require('dotenv').config();

app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/toy', (req,res) => {
  res.json({'data': 'toy'});
})
// SPA - backend is purely API, views are handled by React 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
});

const port = process.env.PORT; 

app.listen(port); 

module.exports = app;
