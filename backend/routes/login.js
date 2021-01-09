const express = require('express');
const validator = require('express-validator');
const jwt = require('jsonwebtoken'); 
const User = require('../models/users').userModel; 
const bcrypt = require('bcrypt'); 
const path = require('path'); 
require('dotenv').config({path: path.resolve('.env')}); 
const create_access_refresh_tokens = require('../utility/utilityFunctions').create_access_refresh_tokens; 

/**
 * Express router to mount login related functions.
 * @type {object}
 * @const
 */
const router = express.Router();

/**
 * This API endpoint mounted on the login router responds to GET request to the '/login' route. It has the responsibility of sanitizing
 * the input arguments recieved, and then validating if they belong to a user in the database. If they do, the client will be notified
 * that verification was succesful and to redirect to the appropriate view. 
 * 
 * @name post/login
 * @function
 * @param {string} path - Express path 
 * @param {callback} middleware - Express middleware
 */
router.post('/', [
    validator.body('username_or_email').escape(),
    validator.body('password').escape(),

    
    async (req, res, next) => {
        const username_or_email = req.body.username_or_email;
        const password = req.body.password; 
        // find user 
        try {
            const user = await User.findOne({
                $or: [
                    {'email': username_or_email},
                    {'username': username_or_email}
                ]
            });

            if (!user) {
                return res.status(401).json({message: "Username or email is invalid"});
            }
            const pw_verification = await user.verifyPassword(password); 
            if (pw_verification === false) {
                return res.status(401).json({message: "Password is incorrect"})
            }
            else {
                // if user is found, password is verified, then we make a jwt
                // access token and request token and return both of them to the client
                const [accessToken, refreshToken] = create_access_refresh_tokens(user.username);
                // update refresh token in the db for the user to be this new refresh token 
                user.refreshToken = refreshToken;
                await user.save(); 
                return res.status(201).json({accessToken, refreshToken}); 
            }
        }
        catch(err) {
            return res.status(500).json({'Error': 'Error processing login request'});
        }
    }
]
); 

router.get('/', (req,res,next) => {
    return res.sendFile(path.join(__dirname, '../../client/build/index.html'))
});

exports.login_router = router; 