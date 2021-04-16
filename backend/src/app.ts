import express, { Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

const app = express();
/**
 * Express router to mount login related functions.
 * @type {object}
 * @const
 */
const { login_router } = require('./routes/login');

/**
 * Express router to mount register related functions.
 * @type {object}
 * @const
 */
const { register_router } = require('./routes/register');

/**
 * Express router to mount the function that refreshes access tokens for the client.
 * @type {object}
 * @const
 */
const refresh_token_router = require('./routes/refreshToken').refreshToken;

/**
 * Express router to mount search related functions.
 * @type {object}
 * @const
 */
const { navbar_router } = require('./routes/navbar');

/**
 * Express router to mount user profile related functions.
 * @type {object}
 * @const
 */
const userprofile_router = require('./routes/userProfile').userProfileRouter;

/**
 * Express router to mount explore related functions.
 * @type {object}
 * @const
 */
const { explore_router } = require('./routes/explore');

/**
 * Express router to mount home page related functions.
 * @type {object}
 * @const
 */
const { homepage_router } = require('./routes/homePage');

dotenv.config();
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(compression());
app.use(
    helmet({
        contentSecurityPolicy: false,
    }),
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());

// Mount middleware - routers
app.use('/accounts/login', login_router);
app.use('/accounts/register', register_router);
app.use('/accounts/refreshToken', refresh_token_router);
app.use('/loggedIn/navbar', navbar_router);
app.use('/explore', explore_router);
app.use('/homepage', homepage_router);
app.use('/:username', userprofile_router);

app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '/../client/build/index.html'));
});

const port = process.env.PORT;
const mongoDB = process.env.MONGO_URL;
// should use different databases for development, production and testing
if (
    process.env.NODE_ENV === 'DEVELOPMENT' ||
    process.env.NODE_ENV === 'production'
) {
    // dev database
    void mongoose.connect(mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

// don't want to create a server if we're testing -- testing will handle creating server given
// the node app
if (process.env.NODE_ENV !== 'TESTING') {
    app.listen(port);
}

module.exports = app;
