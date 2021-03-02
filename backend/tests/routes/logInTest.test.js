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

describe("tests for the log in route", () => {
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

  // test("test log in succeeded email", async function test_log_in(done) {
  //   const res = await agent
  //     .post('/accounts/login')
  //     .send({
  //       username_or_email: 'practice2@gmail.com',
  //       password: '123_practice'
  //     });
      
  //     expect(res.status).toEqual(201);
  //     expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
  //     expect(res.body).toHaveProperty('accessToken');
  //     expect(res.body).toHaveProperty('refreshToken'); 
  //     done();

  // })

  // test("test log in failed -- username/email", async function test_log_in(done) {
  //   const res = await agent
  //     .post('/accounts/login')
  //     .send({
  //       username_or_email: '1231293_test',
  //       password: '123_practice'
  //     });
      
  //     expect(res.status).toEqual(401);
  //     expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
  //     expect(res.body).toHaveProperty('message');
  //     expect(res.body['message']).toEqual("Username or email is invalid"); 
  //     done();
  // })


  // test("test log in failed -- password", async function test_log_in(done) {
  //   const res = await agent
  //     .post('/accounts/login')
  //     .send({
  //       username_or_email: 'test_3',
  //       password: '1235_practice'
  //     })
      
  //     expect(res.status).toEqual(401);
  //     expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
  //     expect(res.body).toHaveProperty('message');
  //     expect(res.body['message']).toEqual("Password is incorrect"); 
  //     (await db).disconnect();
  //     done();
  // })

});
