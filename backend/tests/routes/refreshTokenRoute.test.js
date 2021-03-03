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

test('Test if refresh token GET route functioning properly', async (done) => {
    let login_tokens_res = await request(app)
                                 .post('/accounts/login')
                                 .send({
                                    username_or_email: process.env.user,
                                    password: process.env.pw 
                                 })
                                 .expect(201);

    let [access_token, refresh_token] = [login_tokens_res.body.accessToken, login_tokens_res.body.refreshToken];

    console.log(login_tokens_res.body); 
    done(); 
})