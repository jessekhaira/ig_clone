const request = require('supertest'); 
const app = require('../../app');
const User = require('../../models/users').userModel; 
const setupLocalDatabase = require('../database_setup').setupLocalDatabase; 
setupLocalDatabase(`userProfileTest`);


let accessToken;
beforeAll(async (done) => {
    // sign up new user, get access token for this user and use this user to verify our 
    // search endpoint working correctly 
    let results = await request(app)
        .post('/accounts/register')
        .send({
        'email': 'testing@gmail.com',
        'full_name': 'testing',
        'username': 'testing123',
        'pw_inp': `123456`,
        'date_of_birth': Date.now()
        }); 

    accessToken = results.body.accessToken; 
    done(); 
});


describe('Grouping tests that test GET endpoints built off /:userprofile route', () => {

    test('Make sure GET request fails when no token is attached', async (done) => {
        let results = await request(app)
            .get(`/testing123`)
            .expect(500);

        expect(results.body).toHaveProperty('UnauthorizedUser');
        done();
    }); 

    test('test that base GET request returns back HTML', async (done) => {
        await request(app)
            .get(`/testing123`)
            .set(`Authorization`, accessToken)
            .expect(200)
            .expect('Content-Type', 'text/html; charset=UTF-8');
        done(); 
    });


    test('test that GET request to /editProfile endpoint returns appropriate response', async (done) => {
        let results = (await request(app)
            .get(`/testing123/editProfile`)
            .set(`Authorization`, accessToken)
            .expect(200)
            .expect('Content-Type', /json/)).body;

        expect(results).toHaveProperty('full_name');
        expect(results).toHaveProperty('profile_picture');
        expect(results).toHaveProperty('email');
        expect(results).toHaveProperty('profile_description');     
        done(); 
    });

    test('test that GET request to /profileInfo endpoint returns appropriate response', async (done) => {
        let results = (await request(app)
            .get(`/testing123/profileInfo`)
            .set(`Authorization`, accessToken)
            .expect(200)
            .expect('Content-Type', /json/)).body;
        
        expect(results.full_name).toEqual('testing');
        expect(results).toHaveProperty('profile_picture');
        expect(results.number_posts).toEqual(0);
        expect(results.number_followers).toEqual(0);
        expect(results.number_following).toEqual(0);
        expect(results.username).toEqual('testing123');
        expect(results).toHaveProperty('profile_description');  
        done();           
    });

    test('test that GET request to /profilePhoto endpoint returns appropriate response', async (done) => {
        let results = (await request(app)
            .get(`/testing123/profilePhoto`)
            .set(`Authorization`, accessToken)
            .expect(200)
            .expect('Content-Type', /json/)).body;
        
        expect(results).toHaveProperty('profile_picture');
        done();           
    });

    



}); 