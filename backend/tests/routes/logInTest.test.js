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

describe("Testing POST API endpoints for /accounts/login endpoint", () => {
  test("test log in succeeded username", async function test_log_in(done) {
      const res = await request(app)
        .post('/accounts/login')
        .send({
          username_or_email: process.env.user,
          password: process.env.pw 
        })
        .expect(201)
        .expect('Content-Type', /json/)
        
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken'); 
        done(); 
  })

   test("test log in succeeded email", async function test_log_in(done) {
      const res = await request(app) 
        .post('/accounts/login')
        .send({
          username_or_email: process.env.user_email,
          password: process.env.pw 
        })
        .expect(201)
        .expect('Content-Type', /json/)
        
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken'); 
        done();
  })

    test("test log in failed -- username/email", async function test_log_in(done) {
      const res = await request(app) 
        .post('/accounts/login')
        .send({
          username_or_email: '12312',
          password: process.env.pw
        })
        .expect(401)
        .expect('Content-Type', /json/)
        
        expect(res.body['message']).toEqual("Username or email is invalid"); 
        done();
  })

    test("test log in failed -- password", async function test_log_in(done) {
      const res = await request(app) 
        .post('/accounts/login')
        .send({
          username_or_email: process.env.user,
          password: '123'
        })
        .expect(401)
        .expect('Content-Type', /json/)
        
        expect(res.body['message']).toEqual("Password is incorrect"); 
        done();
    })

});
