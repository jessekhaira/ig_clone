import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import path from 'path';
import dotenv from 'dotenv';
import { User, IUser } from '../models/users';

dotenv.config({ path: path.resolve('.env') });

/**
 * Express router to mount the function that refreshes access tokens using the request tokens stored in clients local storage.
 * @type {object}
 * @const
 */
const router = express.Router();

interface DecodedToken {
    username: string;
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/', async (req: Request, res: Response) => {
    const refreshToken = req.headers.authorization;
    if (!refreshToken) {
        return res.status(400);
    }
    // try to create a new access token, and if there are any errors just return that the request
    // could not be processed (IE: refresh token could be expired, invalid refresh token, etc)
    try {
        const user = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        ) as DecodedToken;
        const { username } = user;
        // check whether refresh token stored in the db for this user is the same
        // as the refresh token passed here
        const userDB: IUser = await User.findOne({ username });
        const dbRefreshToken = userDB.refreshToken;
        if (refreshToken !== dbRefreshToken) {
            return res.status(400).json({ message: 'invalid token' });
        }
        const new_access_token = jwt.sign(
            { username: user.username },
            process.env.ACESS_TOKEN_SECRET,
            { expiresIn: '20m' },
        );
        return res.status(201).json({ new_access_token });
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
});

exports.refreshToken = router;
export default router;
