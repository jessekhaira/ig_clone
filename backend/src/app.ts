/* This module defines and exports a express 
application object which represents the application
server for the instagram clone application. */
import express, { Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import loginRouter from './routes/login';
import registerRouter from './routes/register';
import refreshTokenRouter from './routes/refreshToken';
import exploreRouter from './routes/explore';
import navbarRouter from './routes/navbar';

const app = express();

/**
 * Express router to mount user profile related functions.
 * @type {object}
 * @const
 */
const userprofile_router = require('./routes/userProfile').userProfileRouter;

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
app.use('/accounts/login', loginRouter);
app.use('/accounts/register', registerRouter);
app.use('/accounts/refreshToken', refreshTokenRouter);
app.use('/loggedIn/navbar', navbarRouter);
app.use('/explore', exploreRouter);
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

// don't want to create a server if we're testing -- testing will handle
// creating a server given the node app
if (process.env.NODE_ENV !== 'TESTING') {
    app.listen(port);
}

module.exports = app;
export default app;
