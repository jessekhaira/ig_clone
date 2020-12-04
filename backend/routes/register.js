const express = require('express');
const validator = require('express-validator');
const User = require('../models/users').userModel; 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
require('dotenv').config({path: path.resolve(".env")}); 

/**
 * Express router to mount register related functions.
 * @type {object}
 * @const 
 */
const router = express.Router();

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
  async function(req,res,next) {

    let new_user = new User({
      email: req.body.email,
      full_name: req.body.full_name,
      username: req.body.username_inp,
      password: req.body.pw_inp,
      date_of_birth: req.body.date_of_birth
    });

    try {
      await new_user.save(); 
      // authenticate this user and effectively do a login
      // sending back access token and refresh token 
      const accessToken = jwt.sign({username: new_user.username}, process.env.ACESS_TOKEN_SECRET, {expiresIn: '20m'});
      const refreshToken = jwt.sign({username: new_user.username}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '3d'});
      res.status(201).json({
        accessToken,
        refreshToken
      });
    }
    catch(err) {
      // assuming errors that come when trying to save user to database come from username being
      // used or email being used already
      try {
        const err_email_or_username = err.errors.email || err.errors.username;
        let validation_err_msg = err_email_or_username.properties.message; 
        res.status(400).json({message:validation_err_msg});
      }
      catch(err) {
        res.status(400).json({message:'There was an error during registration. Try again later?'});
      }
    }
  }
]);

exports.register_router = router; 