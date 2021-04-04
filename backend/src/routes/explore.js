const express = require('express');
const validator = require('express-validator');
const User = require('../models/users').userModel; 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const fs = require('fs'); 
const util = require('util');
const readFile = util.promisify(fs.readFile);
require('dotenv').config({path: path.resolve(".env")}); 

/**
 * Express router to mount explore related functions.
 * @type {object}
 * @const 
 */
const router = express.Router();

// deals with case when page is refreshed and the user is logged in -- returns the appropriate view
// for explore page 
router.get('/', (req,res,next) => {
    return res.sendFile(path.join(__dirname, '../../../client/build/index.html'))
});


exports.explore_router = router; 