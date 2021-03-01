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
    test('Test should fail as no JWT included in HTTP req', async (done) => {
        const result = await request(app).get('/homepage/Batman/suggested');
        expect(result.statusCode).toBe(500);
        expect(result.type).toBe('application/json');
        done(); 
    });


    test('Should return suggested users in res body', async (done) => {
        const result = await request(app)
        .get('/homepage/Batman/suggested')
        .set('Authorization', `${token}`)
        .expect(200)
        .expect('Content-Type', /json/);
        
        expect(result.body.suggested_users_to_follow.length).toEqual(0);
        done(); 
    })

    test('Test should return appropriate slice of homepage posts for user', async (done) =>{
        const result = await request(app)
        .get('/homepage/Batman/1')
        .set('Authorization', `${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then((res) => {
            const res_homepage_post = res.body.homepage_posts[0];
            expect(res_homepage_post).toHaveProperty('liked_by');
            expect(res_homepage_post).toHaveProperty('num_comments');
            expect(res_homepage_post).toHaveProperty('prof_pic');
            expect(res_homepage_post).toHaveProperty('username');
            expect(res_homepage_post).toHaveProperty('date_posted');
            expect(res_homepage_post).toHaveProperty('img');
        })
        done(); 
    })

});


