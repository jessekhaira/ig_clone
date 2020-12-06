import {createAction, createReducer} from '@reduxjs/toolkit';


const set_error = createAction('SET_ERROR');
const remove_error = createAction('REMOVE_ERROR');
const INIT_STATE = {error: ''};

const errorReducer = createReducer(INIT_STATE, (builder) => {
    builder
        .addCase(set_error, (state, action) => {
            state.error = action.payload;
        })
        .addCase(remove_error, (state, action) => {
            state.error = ''; 
        })
}); 

export {set_error, remove_error, errorReducer}; 