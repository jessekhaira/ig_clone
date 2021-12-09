const request = require('supertest');
const app = require('../../app');
const User = require('../../models/users').userModel;
const fs = require('fs');
const { setupLocalDatabase } = require('../database_setup');

setupLocalDatabase(`userProfileTest`);

let accessToken;
beforeAll(async (done) => {
    // sign up new user, get access token for this user and use this user to verify our
    // search endpoint working correctly
    const results = await request(app).post('/accounts/register').send({
        email: 'testing@gmail.com',
        full_name: 'testing',
        username: 'testing123',
        pw_inp: `123456`,
        date_of_birth: Date.now(),
    });

    const testing123 = await User.findOne({ username: 'testing123' });
    const testUser2 = await User.findOne({ username: 'testUser2' });
    for (let i = 0; i < 20; i++) {
        if (i === 2 || i === 19) {
            continue;
        }
        const testUserX = await User.findOne({ username: `testUser${i}` });
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
    test("If token is undefined, and we're targetting base endpoint, ensure views returned", async (done) => {
        await request(app)
            .get(`/testing123`)
            .expect(200)
            .expect('Content-Type', 'text/html; charset=UTF-8');
        done();
    });

    test('Make sure GET request fails when incorrect token attached', async (done) => {
        const results = await request(app)
            .get(`/testing123`)
            .set('Authorization', 'incorrect_jwt')
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

    test('testing GET request to /editProfile endpoint', async (done) => {
        const results = (
            await request(app)
                .get(`/testing123/editProfile`)
                .set(`Authorization`, accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;

        expect(results).toHaveProperty('full_name');
        expect(results).toHaveProperty('profile_picture');
        expect(results).toHaveProperty('email');
        expect(results).toHaveProperty('profile_description');
        done();
    });

    test('testing GET request to /profileInfo endpoint', async (done) => {
        const results = (
            await request(app)
                .get(`/testing123/profileInfo`)
                .set(`Authorization`, accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;

        expect(results.full_name).toEqual('testing');
        expect(results).toHaveProperty('profile_picture');
        expect(results.number_posts).toEqual(0);
        expect(results.number_followers).toEqual(0);
        expect(results.number_following).toEqual(18);
        expect(results.username).toEqual('testing123');
        expect(results).toHaveProperty('profile_description');
        done();
    });

    test('testing GET request to /profilePhoto endpoint', async (done) => {
        const results = (
            await request(app)
                .get(`/testing123/profilePhoto`)
                .set(`Authorization`, accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;

        expect(results).toHaveProperty('profile_picture');
        done();
    });

    test('testing GET request to /:loggedInUser/followersBox endpoint', async (done) => {
        const results = (
            await request(app)
                .get(`/testUser2/testing123/followersBox`)
                .set(`Authorization`, accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;

        expect(results.followers.length).toEqual(19);

        for (const follower of results.followers) {
            expect(follower).toHaveProperty('profile_picture');
            expect(follower).toHaveProperty('_id');
            expect(follower).toHaveProperty('username');
            expect(follower.full_name).toEqual('testUser');
            if (follower.username === 'testUser19') {
                expect(follower.curr_user_following_this_user).toEqual(false);
            } else {
                expect(follower.curr_user_following_this_user).toEqual(true);
            }
        }
        done();
    });

    test('testing GET request to /:loggedInUser/followingBox endpoint', async (done) => {
        const results = (
            await request(app)
                .get(`/testUser3/testing123/followingBox`)
                .set(`Authorization`, accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;

        expect(results.following.length).toEqual(1);
        expect(results.following[0].curr_user_following_this_user).toEqual(
            false,
        );
        done();
    });

    test('testing GET request to /:loggedInUser/followingBox endpoint', async (done) => {
        const results = (
            await request(app)
                .get(`/testing123/testing123/followingBox`)
                .set(`Authorization`, accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;

        expect(results.following.length).toEqual(18);
        for (const object of results.following) {
            expect(object).toHaveProperty('profile_picture');
            expect(object).toHaveProperty('_id');
            expect(object).toHaveProperty('username');
            expect(object).toHaveProperty('full_name');
            expect(object).toHaveProperty('curr_user_following_this_user');
            expect(object.curr_user_following_this_user).toEqual(true);
        }
        done();
    });

    test('test GET request to /follow/:follow_user -- our testing123 user should be following appropriate people', async () => {
        for (let i = 0; i < 20; i++) {
            const results = (
                await request(app)
                    .get(`/testing123/follow/testUser${i}`)
                    .set('Authorization', accessToken)
                    .expect(200)
                    .expect('Content-Type', /json/)
            ).body;

            if (i === 2 || i === 19) {
                expect(results.UserFollowingCurrUser).toBe('false');
            } else {
                expect(results.UserFollowingCurrUser).toBe('true');
            }
        }
    });

    test('testing GET request to /posts/:slice_posts_requesting endpoint for user with no posts', async () => {
        const results = (
            await request(app)
                .get(`/testing123/posts/1`)
                .set('Authorization', accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;

        expect(results.photos.length).toBe(0);
    });

    test('testing GET request to /posts/:slice_posts_requesting endpoint for user with posts', async () => {
        const results = (
            await request(app)
                .get(`/testUser9/posts/1`)
                .set('Authorization', accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;

        expect(results.photos.length).toBe(3);
    });

    test(`
        testing GET request to /posts/:slice_posts_requesting endpoint for user with posts -- 
        but slice post requesting is more then we have available`, async () => {
        const results = (
            await request(app)
                .get(`/testUser9/posts/2`)
                .set('Authorization', accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;

        expect(results.photos.length).toBe(0);
    });

    test(`testing GET request to /posts/:slice_posts_requesting endpoint for user not registered on site`, async () => {
        const results = (
            await request(app)
                .get(`/unregistered/posts/1`)
                .set('Authorization', accessToken)
                .expect(500)
                .expect('Content-Type', /json/)
        ).body;

        expect(results).toHaveProperty('userNotFound');
    });

    test('testing GET request to /:grid_img_id endpoint', async () => {
        const gridImgIDsResults = (
            await request(app)
                .get(`/testUser9/posts/1`)
                .set('Authorization', accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;

        const gridImgID = gridImgIDsResults.photos[0].id;

        const results = (
            await request(app)
                .get(`/testUser9/${gridImgID}`)
                .set('Authorization', accessToken)
                .expect(200)
                .expect('Content-Type', /json/)
        ).body;


        expect(results).toHaveProperty('photo_obj');
        const photoInformation = results.photo_obj;
        expect(photoInformation).toHaveProperty('data_photo');
        expect(photoInformation).toHaveProperty('num_likes');
        expect(photoInformation).toHaveProperty('comments');
        expect(photoInformation).toHaveProperty('id');
        expect(photoInformation).toHaveProperty('profile_picture');
    });
});

describe('Grouping tests that test PUT endpoints built off /:userprofile route', () => {
    test("Testing put request to update profile photo, fails without token", async (done) => {
        const photoData = fs.readFileSync(__dirname + '/photo.png');
        const returnedData = await request(app)
            .put(`/testing123/profilePhoto`)
            .attach('name', __dirname + '/photo.png')
            .expect(500)
        done();
    });

    test("Testing put request to update profile photo, should succeed", async (done) => {
        const returnedData = (await request(app)
            .put(`/testing123/profilePhoto`)
            .set('Authorization', accessToken)
            .attach('image', __dirname + '/photo.png')
            .expect(200)
            .expect('Content-Type', /json/)
        ).body;
        
        expect(returnedData).toHaveProperty('Success')
        done();
    });

    test("Testing put request for editing profile, should succeed", async(done) => {
        const returnedData = (await request(app)
            .put(`/testing123/editProfile`)
            .set('Authorization', accessToken)
            .send({
                username: 'testing123',
                email: '123@123.com',
                fullname: '123T',
                profile_bio: '123123'
            })
            .expect(200)
            .expect('Content-Type', /json/)
        ).body;

        expect(returnedData).toHaveProperty('message');
        const testing123 = await User.findOne({ username: 'testing123' });
        expect(testing123.username).toBe('testing123');
        expect(testing123.email).toBe('123@123.com');
        expect(testing123.full_name).toBe('123T');
        expect(testing123.profile_description).toBe('123123');
        done();
    })


    test("Testing put request for editing profile, where username changes, should succeed", async(done) => {
        const returnedData = (await request(app)
            .put(`/testing123/editProfile`)
            .set('Authorization', accessToken)
            .send({
                username: 'test123',
                email: '123@123.com',
                fullname: '123T',
                profile_bio: '123123'
            })
            .expect(200)
            .expect('Content-Type', /json/)
        ).body;

        expect(returnedData).toHaveProperty('accessToken');
        expect(returnedData).toHaveProperty('refreshToken');
        const test123 = await User.findOne({ username: 'test123' });
        expect(test123.username).toBe('test123');
        expect(test123.email).toBe('123@123.com');
        expect(test123.full_name).toBe('123T');
        expect(test123.profile_description).toBe('123123');
        done();
    })
});
