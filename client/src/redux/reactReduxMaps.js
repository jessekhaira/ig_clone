import {remove_curr_error, logUserIn, register_user_logIn} from './features/currentUserSlice';

function mapStateToProps_mainApp(state) {
    return {
        current_user: state.current_user.current_user,
    }
}

function mapDispatchToProps_mainApp(dispatch) {
    return {}
}

function mapStateToProps_SignIn(state) {
    return {
        log_in_status: state.current_user.log_in_status,
        log_in_err: state.current_user.log_in_err,
    }
}

function mapDispatchToProps_SignIn(dispatch) {
    return{
        logUserIn: (user_email_inp, pw_inp) => dispatch(logUserIn(user_email_inp, pw_inp))
    }
}

function mapStateToProps_Register(state) {
    return {
        register_status: state.current_user.register_status, 
        register_err: state.current_user.register,
    }
}

function mapDispatchToProps_Register(dispatch) {
    return {
        register_user_logIn: null 
    }
}

export {mapStateToProps_mainApp, 
        mapDispatchToProps_mainApp, 
        mapStateToProps_SignIn, 
        mapDispatchToProps_SignIn, 
        mapStateToProps_Register,
        mapDispatchToProps_Register
}