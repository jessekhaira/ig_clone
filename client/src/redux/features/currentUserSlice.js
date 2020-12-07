import {createAction, createReducer, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";

// sharing states between registering and signing in because they are related to the same thing
// setting the current user 
const remove_curr_error = createAction('REMOVE_ERROR');
const remove_curr_user = createAction('REMOVE_CURR_USER');
const INIT_STATE = {current_user: '', log_in_status: '', log_in_err: '', register_status: '', register_err: ''};

const logUserIn = createAsyncThunk(
    'users/loginUser',
    async(logInParams, thunkAPI) => {
        const password = logInParams.password;
        const username_or_email = logInParams.username_or_email; 
        const fetchResults = await fetch('/accounts/login', {
            method: 'POST',
            body: JSON.stringify({
                username_or_email,
                password
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        const login_res = await fetchResults.json();
        if ("message" in login_res) {
            throw new Error(login_res.message);
        }
        const accessToken = login_res.accessToken;
        const refreshToken = login_res.refreshToken;
        let decoded = jwt_decode(accessToken);
        let username = decoded.username; 
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken); 
        // set the current user as this users username 
        return username; 
    }
);

const register_user_logIn = createAsyncThunk(
    'users/registerUser',
    async(email, full_name, username, pw_inp, date_of_birth) => {
        const register_result = await fetch('/accounts/register', {
            method: "POST",
            body: JSON.stringify({
                email,
                full_name, 
                username,
                pw_inp,
                date_of_birth
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        }); 
        const jsonified_res = await register_result.json();
        return jsonified_res; 
    }
)



/**
 * Reducer that manages the state related to the current user logged in to the application.
 */
const currentUserReducer = createReducer(INIT_STATE, (builder) => {
    builder
        .addCase('users/loginUser/fulfilled', (state, action) => {
            state.current_user = action.payload; 
            state.log_in_status = 'idle'; 
        })
        .addCase('users/loginUser/rejected', (state, action) => {
            state.log_in_err = action.error.message; 
            state.current_user_status = 'idle'; 
        })
        .addCase('users/loginUser/pending', (state, action) => {
            state.log_in_status = 'pending'; 
        })
        .addCase('users/registerUser/fulfilled', (state, action) => {
            state.current_user = action.payload; 
            state.register_status = 'idle'; 
        })
        .addCase('users/registerUser/rejected', (state, action) => {
            state.register_err = action.error.message; 
            state.register_status = 'idle'; 
        })
        .addCase('users/registerUser/pending', (state, action) => {
            state.register_status = 'pending'; 
        })
}); 

export {remove_curr_error, remove_curr_user ,logUserIn, register_user_logIn, currentUserReducer}; 