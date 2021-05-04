import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('.env') });

/**
 * Express router to mount explore related functions.
 * @type {object}
 * @const
 */
const router = express.Router();

// deals with case when page is refreshed and the user is logged in -- returns the appropriate view
// for explore page
router.get('/', (req: Request, res: Response) => {
    return res.sendFile(
        path.join(__dirname, '../../../client/build/index.html'),
    );
});

export default router;
