const request = require('supertest'); 
const app = require('../../app');
const path = require("path");
const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_URL;
require('dotenv').config({path: path.resolve('.env')}); 

const db = mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

afterAll(() => {
    mongoose.connection.close(); 
})