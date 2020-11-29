//dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var compression = require('compression'); 
var app = express();
var mongoose = require('mongoose');

/**
 * Express router to mount login related functions.
 * @type {object}
 * @const
 */
var login_router = require('./routes/login').login_router; 

/**
 * Express router to mount register related functions.
 * @type {object}
 * @const 
 */
var register_router = require('./routes/register').register_router; 

require('dotenv').config();
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// Mount middleware - routers 
app.use('/login', login_router); 
app.use('/register', register_router); 
// SPA - backend is purely API, views are handled by React 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
});

var mongoDB = process.env.MONGO_URL; 
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const port = process.env.PORT; 
app.listen(port); 

module.exports = app;
