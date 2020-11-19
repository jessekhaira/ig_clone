import {createStore, applyMiddleware} from 'redux';
import ThunkMiddleware from 'redux-thunk';
import {createLogger} from 'redux-logger';


const loggerMiddleware = createLogger();
export const reduxStore = createStore(() => 'init',
    applyMiddleware(
        ThunkMiddleware,
        loggerMiddleware
    )
);