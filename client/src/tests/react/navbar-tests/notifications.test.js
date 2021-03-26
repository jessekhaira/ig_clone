import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setup_parent_component} from '../test-setup/logged-in-component-setup';

setup_parent_component();


let heartIconDropdown = null;
let notif_triangle = null; 

test('testing useEffect for notifications component setting displays', async() => {
    expect(screen.queryByRole('listbox', {name: /holding notifications/})).toBe(null);
    expect(screen.queryByRole('navigation', {name: /enhance display/})).toBe(null);
});