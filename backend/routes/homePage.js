const express = require('express');
const validator = require('express-validator');
const User = require('../models/users').userModel; 
const Photos = require('../models/photos').photosModel; 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const fs = require('fs'); 
const util = require('util');
const readFile = util.promisify(fs.readFile);
const dateDifferential = require('../utility/utilityFunctions').getDateDifferential;
const convertBuffer2Base64 = require('../utility/utilityFunctions').convertBuffer2Base64; 
require('dotenv').config({path: path.resolve(".env")}); 

/**
 * Express router to mount functions for the homepage. 
 * @type {object}
 * @const 
 */
const router = express.Router();

// deals with case when page is refreshed and the user is logged in -- returns the appropriate view
// for explore page 
router.get('/', (req,res,next) => {
    return res.sendFile(path.join(__dirname, '../../client/build/index.html'))
});

router.use((req, res, next) => {
    // have to verify the jwt to get access to any of the routes below so thats what we do first thing 
    try {
        jwt.verify(req.headers.authorization, process.env.ACESS_TOKEN_SECRET);
        return next(); 
    }
    catch(err) {
        return next(err);
    }
});

/**
 * This API Endpoint is out of the scope of main project -- just going to return
 * users own information. But in the future could deploy a machine learning algorithm 
 * behind this endpoint for link prediction, or take a simpler approach to suggest users
 * to follow for current user. 
 */
router.get('/:username/suggested', async (req, res, next) => {
    try {
        const returned_fields = {username:true, full_name:true, profile_picture:true};
        const user = await User.findOne({username: req.params.username}, returned_fields);
        const return_obj = {};
        return_obj['username'] = user.username;
        return_obj['full_name'] = user.full_name;
        return_obj['profile_picture'] = convertBuffer2Base64(user, 'profile_picture');
        
        return res.status(200).json({'profile_info': return_obj, 'suggested_users_to_follow':[]}); 

    }
    catch(err) {
        return next(err); 
    }
})

/** This endpoint was mostly out of the scope of the project -- IG's algorithm for returning home page posts
 * is quite advanced, but this represents a basic algorithm that fetches the 12 most recent posts for a user
 * including their followers that is compatible with infinite scrolling working in the frontend.  
 */
router.get('/:username/:slicepostsreq', async(req,res,next) => {
    try {
        const returned_fields = {photos:true, following:true, profile_picture: true, username: true};
        const user_logged_in = await User.findOne({username:req.params.username}, returned_fields)
                                         .populate({path:'following', model:'User', populate: {path: 'photos', model: 'photos'}})
                                         .populate({path:'photos', model: 'photos'});
        
        const homepage_posts = [];
        // the frontend implements infinite scrolling
        // we are returning 12 posts at a time
        // the 12 posts are the posts that have been posted the most recently 
        // when user wants more posts, scrolling to bottom increases value for slice post req by one compared to
        // previous request, and appropriate values are returned (IE: the slice we are returning has to be in correct
        // order relative to all posts stored)
        const endIdxCurrSliceHomepage = req.params.slicepostsreq*12; 
        const all_posts_following_self_sorted = (getAllPostsHomepage(user_logged_in)).slice(endIdxCurrSliceHomepage-12,endIdxCurrSliceHomepage); 
        for (let post of all_posts_following_self_sorted) {
            const photo_obj = {}; 
            photo_obj['liked_by'] = post.likes.length;
            photo_obj['num_comments'] = post.comments.length;
            photo_obj['prof_pic'] = post.profile_picture.toString('base64')
            photo_obj['username'] = post.username;
            photo_obj['date_posted'] = dateDifferential(post.created_at, new Date(Date.now()));
            photo_obj['img'] = post.data_photo.toString('base64');
            homepage_posts.push(photo_obj);
        }
        return res.status(200).json({homepage_posts: homepage_posts});

    }
    catch(err) {
        return next(err); 
    }
});

function getAllPostsHomepage(user_logged_in) {
    const all_posts = []; 
    for (let photo of user_logged_in.photos) {
        const post_obj = {};
        post_obj['profile_picture'] = user_logged_in.profile_picture;
        post_obj['username'] = user_logged_in.username;
        post_obj['created_at'] = photo.created_at;
        post_obj['data_photo'] = photo.data_photo; 
        post_obj['likes'] = photo.likes;
        post_obj['comments'] = photo.comments;
        all_posts.push(post_obj);
    }

    for (let following_user of user_logged_in.following) {
        for (let photo of following_user.photos) {
            const post_obj = {};
            post_obj['profile_picture'] = following_user.profile_picture;
            post_obj['username'] = following_user.username;
            post_obj['created_at'] = photo.created_at;
            post_obj['data_photo'] = photo.data_photo;
            post_obj['likes'] = photo.likes;
            post_obj['comments'] = photo.comments;
            all_posts.push(post_obj);
        }
    }

    all_posts.sort((a,b) => (a.created_at > b.created_at) ? -1: 1);
    return all_posts; 
}

// handle all the error handling logic for the /users endpoints 
// within this middleware function -- nice and organized 
router.use((err, req, res, next) => {
    err = String(err); 
    if (err.includes('JsonWebTokenError')) {
        return res.status(500).json({'UnauthorizedUser': 'JWT failed to verify'});
    }
    else {
        return res.status(500).json({'ErrorProcessing': 'Error processing the input'});
    }
})

exports.homepage_router = router; 