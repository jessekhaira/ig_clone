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

let token;

// need to set up the token to use for all routes
beforeAll((done) => {
    request(app)
      .post('/accounts/login')
      .send({
        username_or_email: process.env.user,
        password: process.env.pw
      })
      .end((err, response) => {
          token = response.body.accessToken; 
          done(); 
      })
});

afterAll(() => {
    mongoose.connection.close();
});

describe('GET /', () => {
    test('Should require authorization', async () => {
        const result = await request(app).get('/homepage/Batman/suggested');
        expect(result.statusCode).toBe(500);
        expect(result.type).toBe('application/json');
    });


    test('Should return suggested users in res body', async () => {
        const result = await request(app)
        .get('/homepage/Batman/suggested')
        .set('Authorization', `${token}`)
        .expect(200)
        .expect('Content-Type', /json/);
        
        expect(result.body.suggested_users_to_follow.length).toEqual(0);
    })
});


