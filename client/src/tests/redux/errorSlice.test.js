import {set_error, remove_error, errorReducer} from '../../redux/features/errorSlice';



describe('current user slice tests -- including action creators and reducer for this slice of state', () => {
    test('test set error action creator', () => {
        const action_created = set_error('test');
        expect(action_created.payload).toEqual('test');
        const test2 = set_error('');
        expect(test2.payload).toEqual('');
    })

    test('test remove error action creator', () => {
        const action_created = remove_error();
        expect(action_created.payload).toEqual(undefined);
    })

    test('test error reducer', () => {
        const old_state = {error: 'test1'};
        const action = remove_error();
        const new_state = errorReducer(old_state, action);
        expect(new_state.error).toEqual("");

        old_state.error = '';
        const action2 = set_error('test2');
        const new_state2 = errorReducer(old_state, action2);
        expect(new_state2.error).toEqual('test2');
    })
});
