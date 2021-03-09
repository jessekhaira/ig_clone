const request = require('supertest'); 
const app = require('../../app');
const User = require('../../models/users').userModel; 
const setupLocalDatabase = require('../database_setup').setupLocalDatabase; 
setupLocalDatabase(`refreshTokenRouteTest`);


describe('Grouping tests that test GET endpoints built off /:userprofile route', () => {
    
}); 