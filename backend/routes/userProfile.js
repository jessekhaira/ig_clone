const express = require('express');
const validator = require('express-validator');
const User = require('../models/users').userModel; 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const fs = require('fs'); 
const util = require('util');
const { query } = require('express');
const { get } = require('http');
const readFile = util.promisify(fs.readFile);
require('dotenv').config({path: path.resolve(".env")}); 
const convertBuffer2Base64 = require('../utility/utilityFunctions').convertBuffer2Base64; 

/**
 * Express router to mount user profile related functions. 
 * @type {object}
 * @const 
 */
const router = express.Router({ mergeParams: true });



router.get('/editProfile', async(req,res,next) => {
    try {
        const query_information = {
            full_name: true,
            profile_picture: true,
            profile_description: true,
            email: true
        };
        jwt.verify(req.headers.authorization, process.env.ACESS_TOKEN_SECRET);
        const username = req.params.username; 
        const query_result = await User.findOne({username: username}, query_information);
        const full_name = query_result.full_name;
        const profile_picture = convertBuffer2Base64(query_result); 
        const profile_description = query_result.profile_description; 
        const email = query_result.email;

        return res.status(200).json({
            full_name,
            profile_picture,
            email,
            profile_description
        });
    }
    catch(err) {
        return res.status(500).json({"message": "request failed"}); 
    }
});

router.put('/editProfile', [
]);

router.get('/profileInfo', async (req,res, next) => {
    try {
        const query_information = {
            username: true, 
            full_name: true,
            photos: true,
            followers: true,
            following: true,
            profile_picture: true,
            profile_description: true,
        };

        jwt.verify(req.headers.authorization, process.env.ACESS_TOKEN_SECRET);
        const username = req.params.username; 
        const query_result = await User.findOne({username: username}, query_information);
        if (query_result === null) {
            res.status(200).json({userNotFound: "User is not contained within database"})
        }
        const number_followers = query_result.followers.length;
        const number_following = query_result.following.length;
        const number_posts = query_result.photos.length;
        const full_name = query_result.full_name;
        const profile_picture = convertBuffer2Base64(query_result); 

        return res.status(200).json({
            username, 
            number_followers,
            number_following,
            number_posts,
            full_name,
            profile_picture
        }); 
    }
    catch(err) {
        return res.status(500).json({userUnauthorizedError: "User is unauthorized"});
    }
})

router.get('/posts', async (req, res, next) => {
    try {
        const user = jwt.verify(req.headers.authorization, process.env.ACESS_TOKEN_SECRET);

        const query_information = {
            photos: true,
        };
        const query_result = await User.findOne({username: user.username}, query_information);

        console.log(query_result);
        res.json({}); 
    }
    catch(err) {
        console.log(err);
        res.status(500).json({userUnauthorizedError: "User is unauthorized"});
    }
});



exports.userProfileRouter = router; 