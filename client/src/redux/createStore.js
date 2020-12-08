import {createLogger} from 'redux-logger';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {logger} from 'redux-logger';
import thunk from 'redux-thunk';
import {currentUserReducer} from './features/currentUserSlice';
import {removeCurrUser, refreshAccessToken} from './customMiddleware';
const loggerMiddleware = createLogger();

export const reduxStore = configureStore({
    reducer: {
        current_user: currentUserReducer,
    },
    middleware: [logger, removeCurrUser, thunk]
});

