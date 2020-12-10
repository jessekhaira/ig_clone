import {remove_curr_user,set_curr_user} from '../features/currentUserSlice';

function mapStateToProps_loggedInComponents(state) {
    return {
        current_user: state.current_user.current_user,
    }
}

function mapDispatchToProps_loggedInComponents(dispatch) {
    return {
        remove_curr_user: () => dispatch(remove_curr_user()), 
        set_curr_user: (curr_user) => dispatch(set_curr_user(curr_user))
    }
}

export {mapStateToProps_loggedInComponents, mapDispatchToProps_loggedInComponents} 