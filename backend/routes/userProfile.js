const express = require('express');
const validator = require('express-validator');
const User = require('../models/users').userModel; 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const fs = require('fs'); 
const util = require('util');
const { query } = require('express');
const readFile = util.promisify(fs.readFile);
require('dotenv').config({path: path.resolve(".env")}); 
const convert2Base64MongooseDocs = require('../utility/utilityFunctions').convert2Base64MongooseDocs; 

/**
 * Express router to mount user profile related functions. 
 * @type {object}
 * @const 
 */
const router = express.Router();


router.get('/', async (req,res, next) => {
    try {
        // check if user is authorized before returning info.. 
        console.log(req.headers);
        const user = jwt.verify(req.headers.authorization, process.env.ACESS_TOKEN_SECRET);
        // console.log(user);
        const query_information = {
            full_name: true,
            photos: true,
            followers: true,
            following: true,
            profile_picture: true,
            profile_description: true,
        };

        const query_result = await User.findOne({username: user.username}, query_information)[0]; 
        console.log(query_result); 
        // const number_followers = query_result.followers.length;
        // const number_following = query_result.following.length;
        // const number_posts = query_result.photos.length;
        // const full_name = query_result.full_name;
        // const profile_picture = convert2Base64MongooseDocs(query_result.profile_picture); 
        // console.log(profile_picture); 
        res.json({});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({userUnauthorizedError: "User is unauthorized"});
    }

})


exports.userProfileRouter = router; 