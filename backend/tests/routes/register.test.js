const path = require("path");
const request = require('supertest'); 
const app = require('../../app');
require('dotenv').config({path: path.resolve('.env')}); 

test('test register failure -- username already taken', async (done) => {
  let results = await request(app)
                      .post('/accounts/register')
                      .send({
                        'email': 'testing',
                        'full_name': 'testing',
                        'username': `${process.env.user}`,
                        'pw_inp': `${process.env.pw}`,
                        'date_of_birth': 'testing'
                      })
                      .expect(400); 
  expect(results.body).toHaveProperty('message');
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
                        'date_of_birth': 'testing'
                      })
                      .expect(400); 
  expect(results.body).toHaveProperty('message');
  done(); 
}); 

