import {remove_curr_error, logUserIn, register_user_logIn} from './features/currentUserSlice';

function mapStateToProps_mainApp(state) {
    return {
        current_user: state.current_user.current_user,
        curr_user_status: state.current_user.status,
        curr_user_error: state.current_user.error 
    }
}

function mapDispatchToProps_mainApp(dispatch) {
    return {
        logUserIn: (username_or_email, password) => dispatch(logUserIn(username_or_email, password)),
        register_user_logIn: null
    }
}

export {mapStateToProps_mainApp, mapDispatchToProps_mainApp} 