/* This module contains a router with API endpoints for the
/accounts/login route of the application, meant to be imported into
the app.ts module and mounted on the application */
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import dotenv from 'dotenv';
import path from 'path';
import { create_access_refresh_tokens } from '../utility/utilityFunctions';
import { User, IUser } from '../models/users';

dotenv.config({ path: path.resolve('.env') });

interface LoginRequestBody {
    username_or_email: string;
    password: string;
}

/**
 * Express router to mount login related functions.
 * @type {object}
 * @const
 */
const router = express.Router();

/**
 * This API endpoint mounted on the login router responds to GET request to the
 * '/login' route. It has the responsibility of sanitizing the input arguments
 * recieved, and then validating if they belong to a user in the database. If
 * they do, the client will be notified that verification was succesful and to
 * redirect to the appropriate view.
 *
 * @name post/login
 * @function
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 */
router.post('/', [
    body('username_or_email').escape(),
    body('password').escape(),

    async (
        req: Request<
            Record<string, never>,
            Record<string, never>,
            LoginRequestBody
        >,
        res: Response,
    ) => {
        const { username_or_email } = req.body;
        const { password } = req.body;
        // find user
        try {
            const user: IUser = await User.findOne({
                $or: [
                    { email: username_or_email },
                    { username: username_or_email },
                ],
            });

            if (!user) {
                return res
                    .status(401)
                    .json({ message: 'Username or email is invalid' });
            }
            const pwVerification = await user.verifyPassword(password);
            if (pwVerification === false) {
                return res
                    .status(401)
                    .json({ message: 'Password is incorrect' });
            }

            // if user is found, password is verified, then we make a jwt
            // access token and request token and return both of them to
            // the client
            const [accessToken, refreshToken] = create_access_refresh_tokens(
                user.username,
            );
            // update refresh token in the db for the user to be this new
            // refresh token
            user.refreshToken = refreshToken;
            await user.save();
            return res.status(201).json({ accessToken, refreshToken });
        } catch (err) {
            return res
                .status(500)
                .json({ Error: 'Error processing login request' });
        }
    },
]);

router.get('/', (req, res) => {
    return res.sendFile(
        path.join(__dirname, '../../../client/build/index.html'),
    );
});

export default router;
