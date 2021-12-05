const request = require('supertest');
const app = require('../../app');
const { setupLocalDatabase } = require('../database_setup');

setupLocalDatabase(`logInTestDB`);

describe('Testing POST API endpoints for /accounts/login endpoint', () => {
    test('test log in succeeded username and user able to visit profile w/ token', async function test_log_in(done) {
        const res = await request(app)
            .post('/accounts/login')
            .send({
                username_or_email: `testUser15`,
                password: `123456`,
            })
            .expect(201)
            .expect('Content-Type', /json/);

        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');

        await request(app)
            .get(`/testUser15`)
            .set(`Authorization`, res.body.accessToken)
            .expect(200)
            .expect('Content-Type', 'text/html; charset=UTF-8');

        done();
    });

    test('test log in succeeded email', async function test_log_in(done) {
        const res = await request(app)
            .post('/accounts/login')
            .send({
                username_or_email: `testUser15@gmail.com`,
                password: `123456`,
            })
            .expect(201)
            .expect('Content-Type', /json/);

        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');

        done();
        await request(app)
            .get(`/testUser15`)
            .set(`Authorization`, res.body.accessToken)
            .expect(200)
            .expect('Content-Type', 'text/html; charset=UTF-8');

        done();
    });

    test('test log in failed -- username/email', async function test_log_in(done) {
        const res = await request(app)
            .post('/accounts/login')
            .send({
                username_or_email: '12312',
                password: process.env.pw,
            })
            .expect(401)
            .expect('Content-Type', /json/);

        expect(res.body.message).toEqual('Username or email is invalid');
        done();
    });

    test('test log in failed -- password', async function test_log_in(done) {
        const res = await request(app)
            .post('/accounts/login')
            .send({
                username_or_email: `testUser15@gmail.com`,
                password: '123',
            })
            .expect(401)
            .expect('Content-Type', /json/);

        expect(res.body.message).toEqual('Password is incorrect');
        done();
    });
});
