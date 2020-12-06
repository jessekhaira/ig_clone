import {createLogger} from 'redux-logger';
import {configureStore} from '@reduxjs/toolkit';
import {logger} from 'redux-logger';
import {currentUserReducer} from './features/currentUserSlice';
const loggerMiddleware = createLogger();

// overall 
export const reduxStore = configureStore({
    reducer: {
        current_user: currentUserReducer
    }
});

