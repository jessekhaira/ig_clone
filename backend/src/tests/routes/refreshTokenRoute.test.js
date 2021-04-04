const request = require('supertest'); 
const app = require('../../app');
const setupLocalDatabase = require('../database_setup').setupLocalDatabase; 
setupLocalDatabase(`refreshTokenRouteTest`);


test('Test if refresh token GET route functioning properly', async (done) => {
    let login_tokens_res = await request(app)
      .post('/accounts/login')
      .send({
        username_or_email: `testUser8`,
        password: `123456` 
      })
      .expect(201);

    let refresh_token= login_tokens_res.body.refreshToken; 
    
    let new_access_token_res = await request(app)
      .get('/accounts/refreshToken')
      .set('Authorization', `${refresh_token}`)
      .expect(201)
      .expect('Content-Type', /json/)
    
    expect(new_access_token_res.body).toHaveProperty('new_access_token');                                      
    done(); 
})