var express = require('express');
var validator = require('express-validator');

/**
 * Express router to mount register related functions.
 * @type {object}
 * @const 
 */
var router = express.Router();

/**
 * Route handling POST requests to create new users at the /register endpoint. 
 * @name post/register
 * @function
 * @param {string} path - Express path 
 * @param {callback} middleware - Express middleware
 */
router.post('/', [
  validator.body('email'),
  validator.body('full_name'),
  validator.body('username_inp'),
  validator.body('pw_inp'),
  validator.body('date_of_birth'),
  (req,res,next) => {
    console.log(req.body); 
  }
]);

exports.register_router = router; 