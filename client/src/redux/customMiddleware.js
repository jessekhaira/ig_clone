
// Middleware functions for the local storage specifically the access tokens and refresh
// tokens 
export const removeCurrUser = storeAPI => next => action => {
    // User logging out, remove the tokens from the local storage 
    if (action.type === 'REMOVE_CURR_USER') {
        localStorage.removeItem('accessToken'); 
        localStorage.removeItem('refreshToken');
    }
    return next(action)
}


