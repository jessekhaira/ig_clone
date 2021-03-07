const request = require('supertest'); 
const app = require('../../app');
const setupLocalDatabase = require('../database_setup').setupLocalDatabase; 
setupLocalDatabase(`navbarTestDatabase`);


