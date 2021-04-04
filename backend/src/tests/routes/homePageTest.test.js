const request = require('supertest'); 
const app = require('../../app');
const setupLocalDatabase = require('../database_setup').setupLocalDatabase; 
setupLocalDatabase(`testHomepage`); 


describe('GET /', () => {
    let token;
    afterEach(async (done) => {
        let results = await request(app)
        .post('/accounts/login')
        .send({
          username_or_email: 'testUser19',
          password: '123456'
        });

        token = results.body.accessToken; 
        done(); 
    });

    
    test('Test should fail as no JWT included in HTTP req', async (done) => {
        const result = await request(app).get('/homepage/testUser19/suggested');
        expect(result.statusCode).toBe(500);
        expect(result.type).toBe('application/json');
        done(); 
    });

    test('Test should fail, invalid JWT', async (done) => {
        let results = await request(app)
        .get('/homepage/testUser5/suggested')
        .set('Authorization', `123123`)
        .expect(500)
        .expect('Content-Type', /json/);      
        
        expect(results.body).toHaveProperty('UnauthorizedUser');
        done(); 
    })


    test('Should return suggested users in res body', async (done) => {
        let results = await request(app)
        .get('/homepage/testUser19/suggested')
        .set('Authorization', `${token}`)
        .expect(200)
        .expect('Content-Type', /json/);

        expect(results.body.suggested_users_to_follow.length).toEqual(0); 
        done(); 
    })

    test('Test should return appropriate slice of homepage posts for user', async (done) =>{
        let results = await request(app)
        .get('/homepage/testUser19/1')
        .set('Authorization', `${token}`)
        .expect(200)
        .expect('Content-Type', /json/)

        const res_homepage_post = results.body.homepage_posts[0];
        expect(res_homepage_post).toHaveProperty('liked_by');
        expect(res_homepage_post).toHaveProperty('num_comments');
        expect(res_homepage_post).toHaveProperty('prof_pic');
        expect(res_homepage_post).toHaveProperty('username');
        expect(res_homepage_post).toHaveProperty('date_posted');
        expect(res_homepage_post).toHaveProperty('img');
        done(); 
    });


    test('User 19 seeded to follow multiple other users -- homepage should return appropriate number of posts', 
        async (done) =>{
            let results_firstpage = await request(app)
            .get('/homepage/testUser19/1')
            .set('Authorization', `${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

            let results_secondpage = await request(app)
            .get('/homepage/testUser19/2')
            .set('Authorization', `${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

            let results_thirdpage = await request(app)
            .get('/homepage/testUser19/3')
            .set('Authorization', `${token}`)
            .expect(200)
            .expect('Content-Type', /json/);

            expect(results_firstpage.body.homepage_posts.length).toEqual(12); 
            expect(results_secondpage.body.homepage_posts.length).toEqual(12); 
            expect(results_thirdpage.body.homepage_posts.length).toEqual(9); 
            done(); 
    });
    

});


