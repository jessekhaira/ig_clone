const express = require('express');
const validator = require('express-validator');
const User = require('../models/users').userModel; 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const fs = require('fs'); 
const util = require('util');
const readFile = util.promisify(fs.readFile);
require('dotenv').config({path: path.resolve(".env")}); 
const convertArrayPicBuffers2Base64 = require('../utility/utilityFunctions').convertArrayPicBuffers2Base64; 

/**
 * Express router to mount search related functions. 
 * @type {object}
 * @const 
 */
const router = express.Router();

router.post('/search', [
    validator.body('search_query'),
    async (req, res, next) => {
        const search_query = req.body.search_query;
        // assuming user is searching for users
        // logic is going to be kept simple here for ease of implementation
        // but you can tailor the search results to the specific user and 
        // get more advanced 

        const img = await readFile(path.resolve('routes/generic_profile_pic.jpg'));
        const query = {
            "$or": [
                {
                    "username": {"$regex": search_query, "$options":"i"}
                },
                {
                    "full_name": {"$regex": search_query, "$options":"i"}
                }
            ]
        };

        const returned_columns = {
            "profile_picture":true,
            "username" :true,
            "full_name": true,
            "_id": false
        }
        try {
            const users_found = await User.find(query, returned_columns);
            const users_found_profilePicturesBase64Encoded = convertArrayPicBuffers2Base64(users_found, 'profile_picture'); 
            return res.json({searchResults:users_found_profilePicturesBase64Encoded});
        }
        catch(err) {
            next(err); 
        }

    }
]);

router.get('/', (req,res,next) => {
    return res.sendFile(path.join(__dirname, '../../client/build/index.html'))
});



exports.navbar_router = router; 