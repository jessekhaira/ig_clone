const request = require('supertest'); 
const app = require('../../app');
const User = require('../../models/users').userModel; 
const setupLocalDatabase = require('../database_setup').setupLocalDatabase; 
setupLocalDatabase(`navbarTestDatabase`);


describe('testing post route for searching for users in our db, using mock objects created in local db', () => {
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

    afterAll(async (done) => {
        await User.deleteOne({ username: "testing123" });
        done(); 
    });

    test('test search fails if we do not provide valid access token', async (done) => {
        let results = await request(app)
        .post('/loggedIn/navbar')
        .expect(500);

        expect(results.body).toHaveProperty('UnauthorizedUser'); 
        done(); 
    })
});