const path = require("path");
const request = require('supertest'); 
const app = require('../../app');
require('dotenv').config({path: path.resolve('.env')}); 
const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_URL;
const User = require("../../models/users").userModel;

const db = mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

afterAll(() => {
  mongoose.connection.close(); 
})

test('test register failure -- username already taken', async (done) => {
  let results = await request(app)
  .post('/accounts/register')
  .send({
    'email': 'testing',
    'full_name': 'testing',
    'username': process.env.user,
    'pw_inp': process.env.pw,
    'date_of_birth': Date.now()
  })
  .expect(400); 

  expect('This username is already registered to an user').toEqual(results.body.message);
  done(); 
}); 

test('test register failure -- email already taken', async (done) => {
  let results = await request(app)
  .post('/accounts/register')
  .send({
    'email': process.env.user_email,
    'full_name': 'testing',
    'username': 'testing',
    'pw_inp': process.env.pw,
    'date_of_birth': Date.now()
  })
  .expect(400); 

  expect('This email is already registered to an user').toEqual(results.body.message);
  done(); 
}); 

test('test register success', async (done) => {
  let results = await request(app)
  .post('/accounts/register')
  .send({
    'email': 'testing@gmail.com',
    'full_name': 'testing',
    'username': 'testing123',
    'pw_inp': process.env.pw,
    'date_of_birth': Date.now()
  })
  .expect(201); 

  expect(results.body).toHaveProperty('accessToken');
  expect(results.body).toHaveProperty('refreshToken');

  await User.deleteOne({ username: "testing123" });

  done(); 
})

