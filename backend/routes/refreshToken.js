const express = require('express');
const validator = require('express-validator');
const jwt = require('jsonwebtoken'); 
const User = require('../models/users').userModel; 
const path = require('path'); 
require('dotenv').config({path: path.resolve('.env')}); 

/**
 * Express router to mount the function that refreshes access tokens using the request tokens stored in clients local storage.
 * @type {object}
 * @const
 */
const router = express.Router();

router.get('/', async (req, res) => {
        const refreshToken = req.headers.authorization;
        if (!refreshToken) {
            return res.status(400); 
        }
        // try to create a new access token, and if there are any errors just return that the request
        // could not be processed (IE: refresh token could be expired, invalid refresh token, etc) 
        try {
            const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const username = user.username;  
            // check whether refresh token stored in the db for this user is the same
            // as the refresh token passed here
            const user_db = (await User.findOne({username: username}));
            console.log(user_db); 
            const db_refresh_token = user_db.refreshToken;
            console.log(db_refresh_token); 
        //     if (refreshToken !== db_refresh_token) {
        //         return res.status(400);
        //     }
        //     console.log('yk'); 
        //     const new_access_token = jwt.sign({username: user.username}, process.env.ACESS_TOKEN_SECRET, {expiresIn: '20m'});
        //     return res.status(201).json({new_access_token});
        }
        catch(err) {
            console.log(err); 
            return res.status(400); 
        }
    }
)

exports.refreshToken = router; 