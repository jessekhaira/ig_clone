//dependencies
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression'); 
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { body } = require('express-validator');

/**
 * Express router to mount login related functions.
 * @type {object}
 * @const
 */
const login_router = require('./routes/login').login_router; 

/**
 * Express router to mount register related functions.
 * @type {object}
 * @const 
 */
const register_router = require('./routes/register').register_router; 

/**
 * Express router to mount the function that refreshes access tokens for the client. 
 * @type {object}
 * @const 
 */
const refresh_token_router = require('./routes/refreshToken').refreshToken; 

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
app.use(bodyParser.json()); 

// Mount middleware - routers 
app.use('/accounts/login', login_router); 
app.use('/accounts/register', register_router); 
app.use('/accounts/refreshToken', refresh_token_router); 
// SPA - backend is purely API, views are handled by React 
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
});

const mongoDB = process.env.MONGO_URL; 
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const port = process.env.PORT; 
app.listen(port); 

module.exports = app;
