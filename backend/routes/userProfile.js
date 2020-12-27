const express = require('express');
const validator = require('express-validator');
const User = require('../models/users').userModel; 
const Photos = require('../models/photos').photosModel; 
const jwt = require('jsonwebtoken'); 
const path = require('path'); 
const fs = require('fs'); 
const util = require('util');
const { query } = require('express');
const { get } = require('http');
const readFile = util.promisify(fs.readFile);
require('dotenv').config({path: path.resolve(".env")}); 
const convertBuffer2Base64 = require('../utility/utilityFunctions').convertBuffer2Base64; 
const create_access_refresh_tokens = require('../utility/utilityFunctions').create_access_refresh_tokens; 
const convertArrayPicBuffers2Base64 = require('../utility/utilityFunctions').convertArrayPicBuffers2Base64; 
const fileUpload = require('express-fileupload');
const sharp = require('sharp');
/**
 * Express router to mount user profile related functions. 
 * @type {object}
 * @const 
 */
const router = express.Router({ mergeParams: true });

router.use((req, res, next) => {
    // have to verify the jwt to get access to any of the routes below so thats what we do first thing 
    try {
        jwt.verify(req.headers.authorization, process.env.ACESS_TOKEN_SECRET);
        next(); 
    }
    catch(err) {
        next(err);
    }
})

router.get('/editProfile', async(req,res,next) => {
    try {
        const query_information = {
            full_name: true,
            profile_picture: true,
            profile_description: true,
            email: true
        };
        const username = req.params.username; 
        const query_result = await User.findOne({username: username}, query_information);
        const full_name = query_result.full_name;
        const profile_picture = convertBuffer2Base64(query_result, 'profile_picture'); 
        const profile_description = query_result.profile_description; 
        const email = query_result.email;

        return res.status(200).json({
            full_name,
            profile_picture,
            email,
            profile_description
        });
    }
    catch(err) {
        next(err);
    }
});

router.put('/editProfile', [
        validator.body('username'),
        validator.body('email'),
        validator.body('fullname'),
        validator.body('profile_bio'),
        async (req,res, next) => {
            try {
                const current_user_requesting_update = req.params.username;
                let proposed_update = {
                    email: req.body.email,
                    full_name: req.body.fullname,
                    profile_description: req.body.profile_bio
                }
                // if our user has updated their username then we have to issue new access 
                // and refresh tokens because the original ones will be stale as the username as changed
                // username main thing the payload of the tokens are encoding 
                if (current_user_requesting_update !== req.body.username) {
                    proposed_update['username'] = req.body.username; 
                    const [accessToken, refreshToken] = create_access_refresh_tokens(req.body.username);
                    const doc = await User.findOneAndUpdate({username: current_user_requesting_update}, proposed_update, {new: true}); 
                    // update refresh token stored for this user in the database -- making sure to update the
                    // token for the updated user in the database  
                    doc.refreshToken = refreshToken; 
                    doc.save(); 
                    return res.status(200).json({'accessToken': accessToken, 'refreshToken': refreshToken}); 
                }
                else {
                    const doc = await User.findOneAndUpdate({username: current_user_requesting_update}, proposed_update, {new: true}); 
                    return res.status(200).json({'message': 'Succesful put operation'}); 
                }
            }     
            catch(err) {
                next(err); 
            }       
        }
    ]
);

router.get('/profileInfo', async (req,res, next) => {
    try {
        const query_information = {
            username: true, 
            full_name: true,
            photos: true,
            followers: true,
            following: true,
            profile_picture: true,
            profile_description: true,
        };

        const username = req.params.username; 
        const query_result = await User.findOne({username: username}, query_information);
        if (query_result === null) {
            throw Error('userNotFound')
        }
        const number_followers = query_result.followers.length;
        const number_following = query_result.following.length;
        const number_posts = query_result.photos.length;
        const full_name = query_result.full_name;
        const profile_description = query_result.profile_description; 
        const profile_picture = convertBuffer2Base64(query_result, 'profile_picture'); 

        return res.status(200).json({
            username, 
            number_followers,
            number_following,
            number_posts,
            full_name,
            profile_picture,
            profile_description
        }); 
    }
    catch(err) {
        next(err);
    }
});

router.get('/profilePhoto', async (req,res) => {
    const accessTokenRecieved = req.headers.authorization; 
    // the user can change their username, so the requestor has to explicitly 
    // indicate which usernames icon they are fetching 
    try {
        const user_profile_pic = await User.find({username: req.params.username}, 'profile_picture');
        const base64Img = convertArrayPicBuffers2Base64(user_profile_pic, 'profile_picture');
        return res.status(200).json({profile_picture: base64Img});
    }
    catch(err) {
        next(err); 
    }
}); 


router.put('/profilePhoto', [
    // would have some middleware function that verifies the data recieved from the user
    // for the photo but for simplicities sake, allowing through here 
    fileUpload({
        createParentPath: true
    }),
    async (req,res) => {
        try {
            const new_profile_photo = req.files.image.data; 
            await User.findOneAndUpdate({username: req.params.username}, {profile_picture: new_profile_photo});
            return res.status(200).json({'Success':'Success'})
        }
        catch(err) {
            next(err);
        }
    }
])

router.get('/posts/:slice_posts_requesting', async (req, res, next) => {
    // We need to know without keeping state in the backend of which section of posts the user 
    // is requesting, and then slice out that section of posts only. The grid is currently displaying 12 
    // posts by default, and then when the user scrolls down to the bottom, 12 more posts are fetched and shown.
    // location of where the user is obtained with the :slice_posts_requesting parameter in the URL 
    try {
        const query_information = {
            photos: true,
        };
        const endIdxImageSlice = req.params.slice_posts_requesting*12;
        let query_result = await User.findOne({username: req.params.username}, query_information)
                .populate({'path': 'photos', options: { sort: { 'created_at': -1 }}});
        
        if (query_result === null) {
            throw Error('userNotFound')
        }
        let photos = query_result.photos;
        photos = photos.slice(endIdxImageSlice-12, endIdxImageSlice);
        const base64_photos = convertArrayPicBuffers2Base64(photos, 'data_photo');
        const return_obj = [];
        for (const photo of base64_photos) {
            const photoObj = {};
            photoObj['data_photo'] = photo['data_photo'];
            photoObj['num_likes'] = photo['likes'].length;
            photoObj['num_comments'] = photo['comments'].length;
            photoObj['created_at'] = photo['created_at']; 
            return_obj.push(photoObj);            
        }
        return res.status(200).json({photos:return_obj});
    }
    catch(err) {
        next(err);
    }
});

router.post('/posts', [
    fileUpload({
        createParentPath: true
    }),
    // have more middleware here to verify the data recieved from the user but leaving for now
    async (req,res,next) => {
        try {
            const username = req.params.username; 
            const user = await User.findOne({username: username}, {photos:true}); 
            const new_upload_photo_data = await sharp(req.files.image.data).resize(300, 300).toBuffer(); 
            let newPost = new Photos({
                data_photo: new_upload_photo_data
            });
            user.photos.push(newPost);
            await newPost.save(); 
            await user.save(); 
            return res.status(200).json({'Message': 'Post successfully created '});
        }
        catch(err) {
            next(err);
        }
    }
]);

// handle all the error handling logic for the /users endpoints 
// within this middleware function -- nice and organized 
router.use((err, req, res, next) => {
    err = String(err); 
    console.log(err);
    if (err.includes('JsonWebTokenError')) {
        return res.status(500).json({'UnauthorizedUser': 'JWT failed to verify'});
    }
    else if (err.includes('email')) {
        return res.status(500).json({'DuplicateEmail': 'Username already exists in database'})
    }
    else if (err.includes('username')) {
        return res.status(500).json({'DuplicateUsername': 'Username already exists in database'})
    }
    else if (err.includes('userNotFound')) {
        return res.status(500).json({'userNotFound': "User is not contained within database"})
    }
    else {
        return res.status(500).json({'ErrorProcessing': 'Error processing the input'});
    }
})




exports.userProfileRouter = router; 