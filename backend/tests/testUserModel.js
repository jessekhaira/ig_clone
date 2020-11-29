var mongoose = require('mongoose');
var User = require('../models/users').userModel;
require('dotenv').config({path: '../.env'});

var mongoDB = process.env.MONGO_URL; 
console.log(process.env.MONGO_URL);
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// create a user a new user
var testUser = new User({
    email: "practice1@gmail.com", 
    full_name: "practice user", 
    username: "practice123",
    password: "123_practice",
    date_of_birth: "2002-09-15",
    profile_picture: 

});

console.log(testUser.profile_picture);
