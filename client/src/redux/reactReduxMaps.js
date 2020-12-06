import {set_current_user, remove_current_user} from './features/currentUserSlice';
import {set_error, remove_error} from './features/errorSlice';

function mapStateToProps(state) {
    return {
        current_user: state.current_user.current_user,
        error: state.error
    }
}

function mapDispatchToProps(dispatch) {
    return {
        set_current_user: (current_user) => dispatch(set_current_user(current_user)),
        remove_current_user: () => dispatch(remove_current_user()),
        set_error: (error) => dispatch(set_error(error)),
        remove_error: () => dispatch(remove_error())
    }
}

export {mapStateToProps, mapDispatchToProps}; 