const express = require('express');
const validator = require('express-validator');
const User = require('../models/users').userModel; 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const fs = require('fs'); 
const util = require('util');
const readFile = util.promisify(fs.readFile);
const convertBuffer2Base64 = require('../utility/utilityFunctions').convertBuffer2Base64; 
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

/**
 * This API Endpoint is out of the scope of main project -- just going to return
 * users own information. But in the future could deploy a machine learning algorithm 
 * behind this endpoint for link prediction, or take a simpler approach to suggest users
 * to follow for current user. 
 */
router.get('/:username/suggested', async (req, res, next) => {
    try {
        const returned_fields = {username:true, full_name:true, profile_picture:true};
        const user = await User.findOne({username: req.params.username}, returned_fields);
        const return_obj = {};
        return_obj['username'] = user.username;
        return_obj['full_name'] = user.full_name;
        return_obj['profile_picture'] = convertBuffer2Base64(user, 'profile_picture');
        
        return res.status(200).json({'profile_info': return_obj, 'suggested_users_to_follow':[]}); 

    }
    catch(err) {
        return next(err); 
    }
})

router.get('/:userid/:slicepostsreq', async(req,res,next) => {
    try {
        return res.status(200).json({'homePagePosts': true});
    }
    catch(err) {
        return next(err); 
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