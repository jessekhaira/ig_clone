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


    const testing123 = await User.findOne({username: 'testing123'});
    const testUser2 = await User.findOne({username: 'testUser2'});
    for (let i=0; i<20; i++) {
        if (i === 2 || i === 19) {
            continue; 
        }
        const testUserX = await User.findOne({username: `testUser${i}`});
        testUserX.following.push(testUser2);
        testUser2.followers.push(testUserX); 

        testing123.following.push(testUserX); 
        testUserX.followers.push(testing123); 
        await testUserX.save(); 
    }
    await testUser2.save();
    await testing123.save();


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
        expect(results.number_following).toEqual(18);
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



    test('test that GET request to /:loggedInUser/followersBox endpoint returns appropriate response', async (done) => {
        let results = (await request(app)
            .get(`/testUser2/testing123/followersBox`)
            .set(`Authorization`, accessToken)
            .expect(200)
            .expect('Content-Type', /json/)).body;
        
        expect(results.followers.length).toEqual(19);

        for (let follower of results.followers) {
            expect(follower).toHaveProperty("profile_picture");
            expect(follower).toHaveProperty("_id");
            expect(follower).toHaveProperty("username");
            expect(follower.full_name).toEqual("testUser");
            if (follower.username === 'testUser19') {
                expect(follower.curr_user_following_this_user).toEqual(false);
            }
            else {
                expect(follower.curr_user_following_this_user).toEqual(true);
            } 
        }
        done();           
    });

    test('test that GET request to /:loggedInUser/followingBox endpoint returns appropriate response', async (done) => {
        let results = (await request(app)
            .get(`/testUser3/testing123/followingBox`)
            .set(`Authorization`, accessToken)
            .expect(200)
            .expect('Content-Type', /json/)).body;

        expect(results.following.length).toEqual(1);
        expect(results.following[0].curr_user_following_this_user).toEqual(false); 
        done();           
    });

    test('test that GET request to /:loggedInUser/followingBox endpoint returns appropriate response', async (done) => {
        let results = (await request(app)
            .get(`/testing123/testing123/followingBox`)
            .set(`Authorization`, accessToken)
            .expect(200)
            .expect('Content-Type', /json/)).body;

        expect(results.following.length).toEqual(18);
        for (let object of results.following) {
            expect(object).toHaveProperty('profile_picture');
            expect(object).toHaveProperty('_id');
            expect(object).toHaveProperty('username');
            expect(object).toHaveProperty('full_name');
            expect(object).toHaveProperty('curr_user_following_this_user');
            expect(object.curr_user_following_this_user).toEqual(true); 
        }
        done();           
    });



}); 