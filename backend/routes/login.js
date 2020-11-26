var express = require('express');
var router = express.Router();
var validator = require('express-validator');


/**
 * This API endpoint mounted on the router responds to GET request to the '/login' route. It has the responsibility of sanitizing
 * the input arguments recieved, and then validating if they belong to a user in the database. If they do, the client will be notified
 * that verification was succesful and to redirect to the appropriate view. 
 */
router.post('/', [
    validator.body('username').escape(),
    validator.body('password').escape(),

    async (req, res, next) => {
        // pseudocode:
        // from the request body, take the email or username
        // and search in the database for this username
        // if the user is found, then convert plain text pw 
        // to cryptographically secure pw and compare to pw held
        // for this user object. If incorrect, send back an error
        // detailing that pw is incorrect but user found. If correct,
        // then signal to frontend to redirect to the users home page. 
        // res.json({'res': 'response!'});
    }
]
); 

exports.login_router = router; 