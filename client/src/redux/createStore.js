import {createLogger} from 'redux-logger';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {logger} from 'redux-logger';
import thunk from 'redux-thunk';
import {currentUserReducer} from './features/currentUserSlice';
import {statusReducer} from './features/statusSlice'

const loggerMiddleware = createLogger();

// overall 
export const reduxStore = configureStore({
    reducer: {
        current_user: currentUserReducer,
        status: statusReducer
    },
    middleware: [logger, thunk]
});

