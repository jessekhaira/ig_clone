import {remove_curr_error, logUserIn, register_user_logIn} from './features/currentUserSlice';

function mapStateToProps(state) {
    return {
        current_user: state.current_user.current_user,
        current_user_status: state.current_user.current_user_status, 
        error_setting_current_user: state.current_user.error_setting_current_user
    }
}
function mapDispatchToProps(dispatch) {
    return {
        remove_curr_error: () => dispatch(remove_curr_error()),
        logUserIn: (user_email_inp, pw_inp) => dispatch(logUserIn(user_email_inp, pw_inp))
    }
}

export {mapStateToProps, mapDispatchToProps}; 