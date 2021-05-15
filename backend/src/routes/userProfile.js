const express = require('express');
const validator = require('express-validator');
const fileUpload = require('express-fileupload');
const sharp = require('sharp');
const User = require('../models/users').userModel;
const Photos = require('../models/photos').photosModel;
const Comments = require('../models/comments').commentsModel;
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve('.env') });
const { convertBuffer2Base64 } = require('../utility/utilityFunctions');
const { create_access_refresh_tokens } = require('../utility/utilityFunctions');
const {
    convertArrayPicBuffers2Base64,
} = require('../utility/utilityFunctions');
const { getDateDifferential } = require('../utility/utilityFunctions');
/**
 * Express router to mount user profile related functions.
 * @type {object}
 * @const
 */
const router = express.Router({ mergeParams: true });

router.use((req, res, next) => {
    // have to verify the jwt to get access to any of the routes below so thats what we do first thing
    try {
        // dealing with a bug where we refresh on the editprofile page and lose the current view
        // so in that case, we just return the react view (and when react view is returned, we query for
        // information with our token defined)
        if (
            req.headers.authorization === undefined &&
            (req.path === '/editProfile' ||
                req.path === '/' ||
                req.path === '/inbox/')
        ) {
            return returnJS_Views(req, res, next);
        }
        jwt.verify(req.headers.authorization, process.env.ACESS_TOKEN_SECRET);
        return next();
    } catch (err) {
        return next(err);
    }
});

router.get('/', (req, res, next) => {
    return returnJS_Views(req, res, next);
});

/** This function represents a controller located behind endpoints that just return the static
 * files for the application
 * */
function returnJS_Views(req, res, next) {
    return res.sendFile(
        path.join(__dirname, '../../../client/build/index.html'),
    );
}

router.get('/editProfile', async (req, res, next) => {
    try {
        const query_information = {
            full_name: true,
            profile_picture: true,
            profile_description: true,
            email: true,
        };
        const { username } = req.params;
        const query_result = await User.findOne(
            { username },
            query_information,
        );
        const { full_name } = query_result;
        const profile_picture = convertBuffer2Base64(
            query_result,
            'profile_picture',
        );
        const { profile_description } = query_result;
        const { email } = query_result;

        return res.status(200).json({
            full_name,
            profile_picture,
            email,
            profile_description,
        });
    } catch (err) {
        next(err);
    }
});

router.put('/editProfile', [
    validator.body('username'),
    validator.body('email'),
    validator.body('fullname'),
    validator.body('profile_bio'),
    async (req, res, next) => {
        try {
            const current_user_requesting_update = req.params.username;
            const proposed_update = {
                email: req.body.email,
                full_name: req.body.fullname,
                profile_description: req.body.profile_bio,
            };
            // if our user has updated their username then we have to issue new access
            // and refresh tokens because the original ones will be stale as the username as changed
            // username main thing the payload of the tokens are encoding
            if (current_user_requesting_update !== req.body.username) {
                proposed_update.username = req.body.username;
                const [
                    accessToken,
                    refreshToken,
                ] = create_access_refresh_tokens(req.body.username);
                const doc = await User.findOneAndUpdate(
                    { username: current_user_requesting_update },
                    proposed_update,
                    { new: true },
                );
                // update refresh token stored for this user in the database -- making sure to update the
                // token for the updated user in the database
                doc.refreshToken = refreshToken;
                doc.save();
                return res.status(200).json({
                    accessToken,
                    refreshToken,
                });
            }
            const doc = await User.findOneAndUpdate(
                { username: current_user_requesting_update },
                proposed_update,
                { new: true },
            );
            return res.status(200).json({ message: 'Succesful put operation' });
        } catch (err) {
            next(err);
        }
    },
]);

router.get('/profileInfo', async (req, res, next) => {
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

        const { username } = req.params;
        const query_result = await User.findOne(
            { username },
            query_information,
        );
        if (query_result === null) {
            throw Error('userNotFound');
        }
        const number_followers = query_result.followers.length;
        const number_following = query_result.following.length;
        const number_posts = query_result.photos.length;
        const { full_name } = query_result;
        const { profile_description } = query_result;
        const profile_picture = convertBuffer2Base64(
            query_result,
            'profile_picture',
        );

        return res.status(200).json({
            username,
            number_followers,
            number_following,
            number_posts,
            full_name,
            profile_picture,
            profile_description,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/profilePhoto', async (req, res) => {
    // the user can change their username, so the requestor has to explicitly
    // indicate which usernames icon they are fetching
    try {
        const user_profile_pic = await User.find(
            { username: req.params.username },
            'profile_picture',
        );
        const base64Img = convertArrayPicBuffers2Base64(
            user_profile_pic,
            'profile_picture',
        );
        return res.status(200).json({ profile_picture: base64Img });
    } catch (err) {
        next(err);
    }
});

router.put('/profilePhoto', [
    // would have some middleware function that verifies the data recieved from the user
    // for the photo but for simplicities sake, allowing through here
    fileUpload({
        createParentPath: true,
    }),
    async (req, res) => {
        try {
            const new_profile_photo = req.files.image.data;
            await User.findOneAndUpdate(
                { username: req.params.username },
                { profile_picture: new_profile_photo },
            );
            return res.status(200).json({ Success: 'Success' });
        } catch (err) {
            next(err);
        }
    },
]);

// Follow + Following Box Controllers (user clicks to see a list of all the users they are following or are followers of)
router.get('/:loggedInUser/followersBox', async (req, res, next) => {
    try {
        const populate_query = {
            profile_picture: true,
            full_name: true,
            username: true,
        };
        const usersFollowingCurrActiveUser = await User.findOne(
            { username: req.params.username },
            { followers: true, following: true },
        ).populate({
            path: 'followers',
            model: 'User',
            select: populate_query,
        });
        const loggedInUser = await User.findOne(
            { username: req.params.loggedInUser },
            { following: true },
        );
        const returned_obj = convertArrayPicBuffers2Base64(
            usersFollowingCurrActiveUser.followers,
            'profile_picture',
        );
        for (let i = 0; i < returned_obj.length; i++) {
            const user_who_follows_currUser = returned_obj[i];
            user_who_follows_currUser.curr_user_following_this_user = loggedInUser.following.includes(
                user_who_follows_currUser._id,
            );
        }
        return res.status(200).json({ followers: returned_obj });
    } catch (err) {
        next(err);
    }
});

router.get('/:loggedInUser/followingBox', async (req, res, next) => {
    try {
        const populate_query = {
            profile_picture: true,
            full_name: true,
            username: true,
        };
        const usersFollowingCurrActiveUser = await User.findOne(
            { username: req.params.username },
            { following: true },
        ).populate({
            path: 'following',
            model: 'User',
            select: populate_query,
        });

        const loggedInUser = await User.findOne(
            { username: req.params.loggedInUser },
            { following: true },
        );
        const returned_obj = convertArrayPicBuffers2Base64(
            usersFollowingCurrActiveUser.following,
            'profile_picture',
        );
        // following endpoint so automatically the user will be following all the users within this box
        for (let i = 0; i < returned_obj.length; i++) {
            const user_who_follows_currUser = returned_obj[i];
            user_who_follows_currUser.curr_user_following_this_user = loggedInUser.following.includes(
                user_who_follows_currUser._id,
            );
        }
        return res.status(200).json({ following: returned_obj });
    } catch (err) {
        next(err);
    }
});

router.get('/follow/:follow_user', async (req, res, next) => {
    try {
        const logged_in_user = await User.findOne(
            { username: req.params.username },
            { following: true },
        );
        const user_page_viewing = await User.findOne(
            { username: req.params.follow_user },
            { _id: true, followers: true },
        );
        return res.status(200).json({
            UserFollowingCurrUser: `${logged_in_user.following.includes(
                user_page_viewing._id,
            )}`,
        });
    } catch (err) {
        next(err);
    }
});

router.put('/follow/:follow_user', async (req, res, next) => {
    try {
        const user_loggedin = await User.findOne(
            { username: req.params.username },
            { following: true },
        );
        const user_to_follow = await User.findOne(
            { username: req.params.follow_user },
            { _id: true, followers: true },
        );
        // already following means we're stopping following the user_to_follow
        if (user_loggedin.following.includes(user_to_follow._id)) {
            const following_idx = user_loggedin.following.indexOf(
                user_to_follow._id,
            );
            const follower_idx = user_to_follow.followers.indexOf(
                user_loggedin._id,
            );

            user_loggedin.following.splice(following_idx, 1);
            user_to_follow.followers.splice(follower_idx, 1);
        } else {
            user_loggedin.following.push(user_to_follow);
            user_to_follow.followers.push(user_loggedin);
        }
        await user_loggedin.save();
        await user_to_follow.save();
        return res.status(200).json({ Success: 'Success' });
    } catch (err) {
        next(err);
    }
});

// Controllers related to posts
router.post('/posts', [
    fileUpload({
        createParentPath: true,
    }),
    // have more middleware here to verify the data recieved from the user but leaving for now
    async (req, res, next) => {
        try {
            const { username } = req.params;
            const user = await User.findOne({ username }, { photos: true });
            const newPost = new Photos({
                data_photo: req.files.image.data,
                photo_posted_by: user._id,
            });
            user.photos.push(newPost);
            await newPost.save();
            await user.save();
            return res
                .status(200)
                .json({ Message: 'Post successfully created ' });
        } catch (err) {
            next(err);
        }
    },
]);

router.get('/posts/:slice_posts_requesting', async (req, res, next) => {
    // We need to know without keeping state in the backend of which section of posts the user
    // is requesting, and then slice out that section of posts only. The grid is currently displaying 12
    // posts by default, and then when the user scrolls down to the bottom, 12 more posts are fetched and shown.
    // location of where the user is obtained with the :slice_posts_requesting parameter in the URL
    try {
        const query_information = {
            photos: true,
        };
        const endIdxImageSlice = req.params.slice_posts_requesting * 12;
        const query_result = await User.findOne(
            { username: req.params.username },
            query_information,
        ).populate({ path: 'photos', options: { sort: { created_at: -1 } } });

        if (query_result === null) {
            throw Error('userNotFound');
        }
        let { photos } = query_result;
        photos = photos.slice(endIdxImageSlice - 12, endIdxImageSlice);
        const return_obj = [];
        const base64_300x300_photos = [];
        // have to resize every photo to be 300x300 in order for the grid to look uniform and clean
        for (let photo of photos) {
            photo = photo.toObject();
            photo.data_photo = await sharp(photo.data_photo.buffer)
                .resize(300, 300)
                .toBuffer();
            photo.data_photo = photo.data_photo.toString('base64');
            base64_300x300_photos.push(photo);
        }
        for (const photo of base64_300x300_photos) {
            const photoObj = {};
            photoObj.id = photo._id;
            photoObj.data_photo = photo.data_photo;
            photoObj.num_likes = photo.likes.length;
            photoObj.num_comments = photo.comments.length;
            photoObj.created_at = photo.created_at;
            return_obj.push(photoObj);
        }
        return res.status(200).json({ photos: return_obj });
    } catch (err) {
        next(err);
    }
});

router.get('/:grid_img_id', async (req, res, next) => {
    try {
        const { grid_img_id } = req.params;
        const populate_query = [{ path: 'comments' }];
        const grid_img = await Photos.findById(grid_img_id).populate(
            populate_query,
        );
        const profile_pic = await User.findById(grid_img.photo_posted_by, {
            profile_picture: true,
        });
        const photo_obj = {};
        photo_obj.id = grid_img._id;
        photo_obj.data_photo = convertBuffer2Base64(grid_img, 'data_photo');
        photo_obj.num_likes = grid_img.likes.length;
        photo_obj.comments = grid_img.comments;
        photo_obj.created_at = getDateDifferential(
            grid_img.created_at,
            new Date(Date.now()),
        );

        photo_obj.profile_picture = convertBuffer2Base64(
            profile_pic,
            'profile_picture',
        );

        return res.status(200).json({ photo_obj });
    } catch (err) {
        return next(err);
    }
});

router.delete('/:grid_img_id', async (req, res, next) => {
    try {
        const grid_img_id = String(req.params.grid_img_id);
        // we have to delete the picture from the pictures model
        await Photos.findByIdAndDelete(grid_img_id);
        const user = await User.findOne(
            { username: req.params.username },
            { photos: true },
        );
        let idxDelete = null;
        for (let i = 0; i < user.photos.length; i++) {
            const curr_photo_id = String(user.photos[i]);
            if (curr_photo_id === grid_img_id) {
                idxDelete = i;
                break;
            }
        }
        user.photos.splice(idxDelete, 1);
        await user.save();
        return res.status(200).json({ Success: 'Image deleted succesfully' });
    } catch (err) {
        next(err);
    }
});

// handle all the error handling logic for the /users endpoints
// within this middleware function -- nice and organized
router.use((err, req, res, next) => {
    err = String(err);
    if (err.includes('JsonWebTokenError')) {
        return res
            .status(500)
            .json({ UnauthorizedUser: 'JWT failed to verify' });
    }
    if (err.includes('email')) {
        return res
            .status(500)
            .json({ DuplicateEmail: 'Username already exists in database' });
    }
    if (err.includes('username')) {
        return res
            .status(500)
            .json({ DuplicateUsername: 'Username already exists in database' });
    }
    if (err.includes('userNotFound')) {
        return res
            .status(500)
            .json({ userNotFound: 'User is not contained within database' });
    }

    return res
        .status(500)
        .json({ ErrorProcessing: 'Error processing the input' });
});

exports.userProfileRouter = router;
