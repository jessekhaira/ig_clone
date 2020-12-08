import {createLogger} from 'redux-logger';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {logger} from 'redux-logger';
import thunk from 'redux-thunk';
import {currentUserReducer} from './features/currentUserSlice';
import {refreshReduxWithLocalStorage} from './customMiddleware';
const loggerMiddleware = createLogger();


const anotherExampleMiddleware = storeAPI => next => action => {

    return next(action)
  }

export const reduxStore = configureStore({
    reducer: {
        current_user: currentUserReducer,
    },
    middleware: [logger, refreshReduxWithLocalStorage, thunk]
});

