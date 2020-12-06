import {createAction, createReducer} from '@reduxjs/toolkit';

const INIT_STATE = {status: 'idle'};
const set_status_idle = createAction('SET_STATUS_IDLE');
const set_status_loading = createAction('SET_STATUS_LOADING');
const set_status_succeeded = createAction('SET_STATUS_SUCCEEDED');
const set_status_failed = createAction('SET_STATUS_FAILED'); 

/**
 * Reducer that manages the state for the status of the application as it 
 * makes API calls to the server. 
 */
const statusReducer = createReducer(INIT_STATE, (builder) => {
    builder
        .addCase(set_status_idle, (state, action) => {
            state.status = 'idle'
        })
        .addCase(set_status_loading, (state, action) => {
            state.status = 'loading'
        })
        .addCase(set_status_succeeded, (state, action) => {
            state.status = 'succeeded';
        })
        .addCase(set_status_failed, (state, action) => {
            state.status = 'failed';
            state.error = action.payload; 
        })
}); 

export {set_status_failed, set_status_idle, set_status_loading, set_status_succeeded, statusReducer}; 