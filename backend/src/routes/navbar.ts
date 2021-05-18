import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import path from 'path';
import { User, IUser } from '../models/users';
import { convertArrayPicBuffers2Base64 } from '../utility/utilityFunctions';

/**
 * Express router to mount search related functions.
 * @type {object}
 * @const
 */
const router = express.Router();

interface SearchPostEndpointRequestBody {
    search_query: string;
}

/**
 * This endpoint responds to POST requests targetting the search endpoint. This endpoint accepts a search query
 * within the request body, which is validated, and then is used to search the Mongo database for any users that
 * match the query.
 */
router.post('/search', [
    body('search_query'),
    async (
        req: Request<
            Record<string, never>,
            Record<string, never>,
            SearchPostEndpointRequestBody
        >,
        res: Response,
    ) => {
        const { search_query } = req.body;
        const query = {
            $or: [
                {
                    username: { $regex: search_query, $options: 'i' },
                },
                {
                    full_name: { $regex: search_query, $options: 'i' },
                },
            ],
        };

        const returnedColumns = {
            profile_picture: true,
            username: true,
            full_name: true,
            _id: false,
        };
        try {
            const usersFound = await User.find(query, returnedColumns);
            const usersFoundProfilePicBase64Encoded = convertArrayPicBuffers2Base64(
                usersFound,
                'profile_picture',
            );
            return res.json({
                searchResults: usersFoundProfilePicBase64Encoded,
            });
        } catch (err) {
            return res.json({ Error: 'Error Processing' });
        }
    },
]);

/**
 * GET requests to the /navbar endpoint just return the frontend files -- happen when user refreshes page after being logged
 * in.
 */
router.get('/', (req: Request, res: Response) => {
    return res.sendFile(
        path.join(__dirname, '../../../client/build/index.html'),
    );
});

export default router;
