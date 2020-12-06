import {set_current_user, remove_current_user, currentUserReducer} from '../../redux/features/currentUserSlice';



describe('current user slice tests -- including action creators and reducer for this slice of state', () => {
    test('test set current user action creator', () => {
        const action_created = set_current_user('test');
        expect(action_created.payload).toEqual('test');
        const test2 = set_current_user('');
        expect(test2.payload).toEqual('');
    })

    test('test remove current user action creator', () => {
        const action_created = remove_current_user();
        expect(action_created.payload).toEqual(undefined);
    })

    test('test current user reducer', () => {
        const old_state = {current_user: 'test1'};
        const action = remove_current_user();
        const new_state = currentUserReducer(old_state, action);
        expect(new_state.current_user).toEqual('');

        old_state.current_user = '';
        const action2 = set_current_user('test2');
        const new_state2 = currentUserReducer(old_state, action2);
        expect(new_state2.current_user).toEqual('test2');
    })
});
