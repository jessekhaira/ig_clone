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
}); 