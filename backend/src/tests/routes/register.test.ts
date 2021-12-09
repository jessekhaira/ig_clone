const request = require('supertest');
const app = require('../../app');
const User = require('../../models/users').userModel;
const { setupLocalDatabase } = require('../database_setup');

setupLocalDatabase(`refreshTokenRouteTest`);

describe('Group of tests testing the POST endpoints for registering', () => {
    test('test register failure -- username already taken', async (done) => {
        const results = await request(app)
            .post('/accounts/register')
            .send({
                email: 'testing',
                full_name: 'testing',
                username: `testUser3`,
                pw_inp: `123456`,
                date_of_birth: Date.now(),
            })
            .expect(400);

        expect('This username is already registered to an user').toEqual(
            results.body.message,
        );
        done();
    });

    test('test register failure -- email already taken', async (done) => {
        const results = await request(app)
            .post('/accounts/register')
            .send({
                email: `testUser3@gmail.com`,
                full_name: 'testing',
                username: 'testing',
                pw_inp: `123456`,
                date_of_birth: Date.now(),
            })
            .expect(400);

        expect('This email is already registered to an user').toEqual(
            results.body.message,
        );
        done();
    });

    test('test register success', async (done) => {
        const results = await request(app)
            .post('/accounts/register')
            .send({
                email: 'testing@gmail.com',
                full_name: 'testing',
                username: 'testing123',
                pw_inp: `123456`,
                date_of_birth: Date.now(),
            })
            .expect(201);

        expect(results.body).toHaveProperty('accessToken');
        expect(results.body).toHaveProperty('refreshToken');

        await User.deleteOne({ username: 'testing123' });

        done();
    });
});
