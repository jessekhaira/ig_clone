import {screen, wait, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setup_parent_component} from '../test-setup/logged-in-component-setup';
import { MemoryRouter } from 'react-router-dom';


setup_parent_component(true);

beforeEach(() => {
    delete window.location
    window.location = { reload: jest.fn() }
})

test('', async () => {
    await waitFor(() => 
        expect(localStorage.getItem('accessToken')).toBe(null) 
    )   
    expect(localStorage.getItem('refreshToken')).toBe(null);
    expect(window.location.reload).toHaveBeenCalled();
});

