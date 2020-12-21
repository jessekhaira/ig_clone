const express = require('express');
const validator = require('express-validator');
const User = require('../models/users').userModel; 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const fs = require('fs'); 
const util = require('util');
const readFile = util.promisify(fs.readFile);
require('dotenv').config({path: path.resolve(".env")}); 
const convert2Base64MongooseDocs = require('../utility/utilityFunctions').convert2Base64MongooseDocs; 

/**
 * Express router to mount user profile related functions. 
 * @type {object}
 * @const 
 */
const router = express.Router();


router.get('/', (req,res, next) => {
    try {
        // check if user is authorized before returning info.. 
        const user = jwt.verify(req.headers.authorization, process.env.ACESS_TOKEN_SECRET);
        
        res.json({});
    }
    catch(err) {

    }

})


exports.userProfileRouter = router; 