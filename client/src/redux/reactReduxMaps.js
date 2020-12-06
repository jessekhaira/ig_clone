import {set_current_user, remove_current_user} from './features/currentUserSlice';
import {set_status_failed, set_status_idle, set_status_loading, set_status_succeeded} from './features/statusSlice';

function mapStateToProps(state) {
    return {
        current_user: state.current_user.current_user,
        status: state.status
    }
}

function mapDispatchToProps(dispatch) {
    return {
        set_current_user: (current_user) => dispatch(set_current_user(current_user)),
        remove_current_user: () => dispatch(remove_current_user()),
        set_status_failed: () => dispatch(set_status_failed()),
        set_status_idle: () => dispatch(set_status_idle()),
        set_status_loading: () => dispatch(set_status_loading()),
        set_status_succeeded: () => dispatch(set_status_succeeded())
    }
}

export {mapStateToProps, mapDispatchToProps}; 