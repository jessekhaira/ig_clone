var express = require('express');

/**
 * Express router to mount register related functions.
 * @type {object}
 * @const 
 */
var router = express.Router();
var validator = require('express-validator');

/**
 * Route handling POST requests to create new users at the /register endpoint. 
 * @name post/register
 * @function
 * @param {string} path - Express path 
 * @param {callback} middleware - Express middleware
 */
router.post('/', [
  (req,res,next) => {
    console.log(req.body); 
  }
]);

exports.register_router = router; 