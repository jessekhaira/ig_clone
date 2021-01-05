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
 * Express router to mount functions for the homepage. 
 * @type {object}
 * @const 
 */
const router = express.Router();

// deals with case when page is refreshed and the user is logged in -- returns the appropriate view
// for explore page 
router.get('/', (req,res,next) => {
    return res.sendFile(path.join(__dirname, '../../client/build/index.html'))
});

router.use((req, res, next) => {
    // have to verify the jwt to get access to any of the routes below so thats what we do first thing 
    try {
        jwt.verify(req.headers.authorization, process.env.ACESS_TOKEN_SECRET);
        return next(); 
    }
    catch(err) {
        return next(err);
    }
});


router.get('/:userid/:slicepostsreq', async(req,res,next) => {
    try {
        console.log(req.params.userid);
        console.log(req.params.slicepostsreq);

        return res.status(200).json({'homePagePosts': true});
    }
    catch(err) {
        next(err); 
    }
});

// handle all the error handling logic for the /users endpoints 
// within this middleware function -- nice and organized 
router.use((err, req, res, next) => {
    err = String(err); 
    if (err.includes('JsonWebTokenError')) {
        return res.status(500).json({'UnauthorizedUser': 'JWT failed to verify'});
    }
    else {
        return res.status(500).json({'ErrorProcessing': 'Error processing the input'});
    }
})

exports.homepage_router = router; 