import jwt_decode from "jwt-decode";

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


export const checkTokenExpirationMiddleware = store => next => async action => {
    // if the access token isn't null, means user has been verified and we should be 
    // checking whether or not access token is expired 
    if (localStorage.getItem('accessToken') !== null) {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        // check accessToken expiry -- don't want to send needless requests to the API
        // if our token isnt expired 
        if (jwt_decode(accessToken).exp < Date.now() / 1000) {
            const new_access_token_raw = await fetch(
                '/accounts/refreshToken',
                {
                    method: 'GET',
                    headers: {
                        authorization: refreshToken
                    }
                }
            ); 
            const new_access_token = await new_access_token_raw.json(); 
            if ("message" in new_access_token) {
                // access token is expired and we failed to renew the access token
                // using the refresh token so clear everything out of local storage 
                // and the user will be effectively logged out
                localStorage.clear(); 
            }
            else {
                // otherwise our access token has been refreshed succesfully and we forward the
                // action onward with a valid access token
                localStorage.setItem('accessToken', new_access_token.new_access_token);
                console.log('new access token set!');
            }
        }
    }
    next(action); 
};