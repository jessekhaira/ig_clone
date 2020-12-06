import {createAction, createReducer} from '@reduxjs/toolkit';


const set_current_user = createAction('SET_USER');
const remove_current_user = createAction('REMOVE_USER');
const INIT_STATE = {current_user: ''}; 

const currentUserReducer = createReducer(INIT_STATE, (builder) => {
    builder
        .addCase(set_current_user, (state, action) => {
            state.current_user = action.payload;
        })
        .addCase(remove_current_user, (state, action) => {
            state.current_user = ''; 
        })
}); 

export {set_current_user, remove_current_user, currentUserReducer}; 