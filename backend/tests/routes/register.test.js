const path = require("path");
require("dotenv").config({ path: path.resolve(".env") });
const request = require('supertest'); 
const app = require('../../app');
const mongoose = require('mongoose');
const mongoDB = process.env.MONGO_URL;

const db = mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

afterAll(() => {
  mongoose.connection.close();
});


test('test register failure -- username already taken', async (done) => {
  let results = await request(app)
                      .post('/accounts/register')
                      .send({
                        'email': 'testing',
                        'full_name': 'testing',
                        'username_inp': process.env.user,
                        'pw_inp': process.env.pw,
                        'date_of_birth': 'testing'
                      })
                      .expect(400); 
  expect(results.body).toHaveProperty('message')
  done(); 
}); 

test('test register failure -- email already taken', async (done) => {
  let results = await request(app)
                      .post('/accounts/register')
                      .send({
                        'email': process.env.user_email,
                        'full_name': 'testing',
                        'username_inp': 'testing',
                        'pw_inp': process.env.pw,
                        'date_of_birth': 'testing'
                      })
                      .expect(400); 
  expect(results.body).toHaveProperty('message')
  done(); 
}); 