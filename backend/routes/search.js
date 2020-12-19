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
 * Express router to mount search related functions. 
 * @type {object}
 * @const 
 */
const router = express.Router();


router.post('/', [
    validator.body('search_query_string'),
    async (req, res) => {
        console.log(req.body); 
    }
]);

exports.search_router = router; 