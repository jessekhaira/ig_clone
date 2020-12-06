import {set_current_user, remove_current_user} from './features/currentUserSlice'

function mapStateToProps(state) {
    return {
        current_user: state.current_user.current_user
    }
}

function mapDispatchToProps(dispatch) {
    return {
        set_current_user: (current_user) => dispatch(set_current_user(current_user)),
        remove_current_user: () => dispatch(remove_current_user())
    }
}

export {mapStateToProps, mapDispatchToProps}; 