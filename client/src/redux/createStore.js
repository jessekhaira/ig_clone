import {createLogger} from 'redux-logger';
import {configureStore} from '@reduxjs/toolkit';
import {logger} from 'redux-logger';

const loggerMiddleware = createLogger();

// overall 
export const reduxStore = configureStore({
    reducer: {
        placeholder: null 
    }
});

