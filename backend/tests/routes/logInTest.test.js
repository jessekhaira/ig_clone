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

describe("tests for the log in route", () => {
  let server,agent; 
  beforeEach((done) => {
    server = app.listen(process.env.PORT, (err) => {
      if (err) return done(err);
       agent = request.agent(server); 
       done();
    });
  });

  afterEach((done) => {
    server && server.close(done);
  });


  test("test log in succeeded username", async function test_log_in(done) {
    const res = await agent
      .post('/accounts/login')
      .send({
        username_or_email: 'test_2',
        password: '123_practice'
      })
      
      expect(res.status).toEqual(201);
      expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken'); 
      expect(res).toHaveProperty('body');
      done(); 
  })

  test("test log in succeeded email", async function test_log_in(done) {
    const res = await agent
      .post('/accounts/login')
      .send({
        username_or_email: 'practice2@gmail.com',
        password: '123_practice'
      });
      
      expect(res.status).toEqual(201);
      expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken'); 
      done();

  })

  test("test log in failed -- username/email", async function test_log_in(done) {
    const res = await agent
      .post('/accounts/login')
      .send({
        username_or_email: '1231293_test',
        password: '123_practice'
      });
      
      expect(res.status).toEqual(401);
      expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
      expect(res.body).toHaveProperty('message');
      expect(res.body['message']).toEqual("Username or email is invalid"); 
      done();
  })


  test("test log in failed -- password", async function test_log_in(done) {
    const res = await agent
      .post('/accounts/login')
      .send({
        username_or_email: 'test_3',
        password: '1235_practice'
      })
      
      expect(res.status).toEqual(401);
      expect(res.headers['content-type']).toEqual('application/json; charset=utf-8');
      expect(res.body).toHaveProperty('message');
      expect(res.body['message']).toEqual("Password is incorrect"); 
      (await db).disconnect();
      done();
  })

});
