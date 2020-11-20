var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var usersRouter = require('./routes/users');
var helmet = require('helmet');
var compression = require('compression'); 
var app = express();
var mongoose = require('mongoose');
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

app.get('/toy', (req,res) => {
  res.json({'data': 'toy'});
})
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
