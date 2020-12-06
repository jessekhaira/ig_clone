import {set_status_failed, set_status_idle, set_status_loading, set_status_succeeded, statusReducer} from '../../redux/features/statusSlice';

describe('status slice tests -- including action creators and reducer for this slice of state', () => {

    test('test status reducer', () => {
        const old_state = {status: 'succeeded'};
        const action = set_status_idle();
        const new_state = statusReducer(old_state, action);
        expect(new_state.status).toEqual('idle');

        old_state.status = 'loading';
        const action2 = set_status_succeeded();
        const new_state2 = statusReducer(old_state, action2);
        expect(new_state2.status).toEqual('succeeded');

        old_state.status = 'loading';
        const action3 = set_status_failed();
        const new_state3 = statusReducer(old_state, action3);
        expect(new_state3.status).toEqual('failed');
    })
});
