import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import util from 'util';

const User = require('../models/users').userModel;

const readFile = util.promisify(fs.readFile);
dotenv.config({ path: path.resolve('.env') });

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
    body('email'),
    body('full_name'),
    body('username_inp'),
    body('pw_inp'),
    body('date_of_birth'),
    async function (req: Request, res: Response) {
        const accessToken = jwt.sign(
            { username: req.body.username },
            process.env.ACESS_TOKEN_SECRET,
            { expiresIn: '20m' },
        );
        const refreshToken = jwt.sign(
            { username: req.body.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '3d' },
        );

        // whenever a new user signs up, we assign a default profile picture
        const default_profile_picture = await readFile(
            `${__dirname}/generic_profile_pic.jpg`,
        );
        const new_user = new User({
            email: req.body.email,
            full_name: req.body.full_name,
            username: req.body.username,
            password: req.body.pw_inp,
            date_of_birth: req.body.date_of_birth,
            refreshToken,
            profile_picture: default_profile_picture,
        });

        try {
            // authenticate this user and effectively do a login
            // sending back access token and refresh token
            await new_user.save();

            return res.status(201).json({
                accessToken,
                refreshToken,
            });
        } catch (err) {
            // assuming errors that come when trying to save user to database come from username being
            // used or email being used already
            try {
                const err_email_or_username =
                    err.errors.email || err.errors.username;
                const validation_err_msg: string =
                    err_email_or_username.properties.message;
                return res.status(400).json({ message: validation_err_msg });
            } catch (Err) {
                return res.status(400).json({
                    message:
                        'There was an error during registration. Try again later?',
                });
            }
        }
    },
]);

router.get('/', (req: Request, res: Response) => {
    return res.sendFile(
        path.join(__dirname, '../../../client/build/index.html'),
    );
});

exports.register_router = router;
