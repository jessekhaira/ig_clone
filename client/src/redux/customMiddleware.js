import jwt_decode from "jwt-decode";

export const refreshReduxWithLocalStorage = storeAPI => next => action => {
    if (localStorage.getItem('accessToken') !== null && storeAPI.getState().current_user === '') {

    }
    return next(action)
}
