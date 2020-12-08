

export const removeCurrUser = storeAPI => next => action => {
    // User logging out, remove the tokens from the local storage 
    if (action.type === 'REMOVE_CURR_USER') {
        localStorage.setItem('accessToken'); 
        localStorage.setItem('refreshToken');
    }
    return next(action)
}

export const refreshAccessToken = storeAPI => next => action => {
    // Make API call to refresh token if accessing protected routes
    return next(action)
}