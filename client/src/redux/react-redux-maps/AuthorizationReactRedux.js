import {remove_curr_error, set_curr_user,logUserIn, register_user_logIn} from '../features/currentUserSlice';

function mapStateToProps_authComponents(state) {
    return {
        current_user: state.current_user.current_user,
        curr_user_status: state.current_user.status,
        curr_user_error: state.current_user.error 
    }
}

function mapDispatchToProps_authComponents(dispatch) {
    return {
        logUserIn: (username_or_email, password) => dispatch(logUserIn(username_or_email, password)),
        register_user_logIn: (email_inp, name_inp, username_inp, pw_inp, date_of_birth_inp) => dispatch(register_user_logIn(email_inp, name_inp, username_inp, pw_inp, date_of_birth_inp)),
        set_curr_user: (curr_user) => dispatch(set_curr_user(curr_user))
    }
}

export {mapStateToProps_authComponents, mapDispatchToProps_authComponents} 