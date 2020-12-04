const express = require('express');
const validator = require('express-validator');
const jwt = require('jsonwebtoken'); 
const User = require('../models/users').userModel; 

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
        const user = await User.findOne({
            $or: [
            {
                'email': username_or_email,
            },
            {
                'username': username_or_email
            }
        ]
        });

        res.json({user}); 
    }
]
); 

exports.login_router = router; 