import {createAction, createReducer, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import jwt_decode from "jwt-decode";

// sharing states between registering and signing in because they are related to the same thing
// setting the current user 
const remove_curr_user = createAction('REMOVE_CURR_USER');
const INIT_STATE = {current_user: '', status:'', error: ''};

const logUserIn = createAsyncThunk(
    'users/setCurrUser',
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
    'users/setCurrUser',
    async(register_params) => {
        const {email, full_name, username, pw_inp, date_of_birth} = register_params; 
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
        if ("message" in jsonified_res) {
            throw new Error(jsonified_res.message); 
        }
        const accessToken = jsonified_res.accessToken;
        const refreshToken = jsonified_res.refreshToken;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken); 
        // set the current user as this users username 
        return username; 
    }
)


/**
 * Reducer that manages the state for the signin and register pages 
 */
const currentUserReducer = createReducer(INIT_STATE, (builder) => {
    builder
        .addCase('users/setCurrUser/fulfilled', (state, action) => {
            state.current_user = action.payload; 
            state.status = 'idle'; 
        })
        .addCase('users/setCurrUser/rejected', (state, action) => {
            state.error = action.error.message; 
            state.status = 'idle'; 
        })
        .addCase('users/setCurrUser/pending', (state, action) => {
            state.status = 'pending';
            state.error = '';  
        })
}); 

export {remove_curr_user ,logUserIn, register_user_logIn, currentUserReducer}; 