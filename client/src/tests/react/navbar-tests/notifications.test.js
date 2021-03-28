import {screen, wait, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setup_parent_component} from '../test-setup/logged-in-component-setup';

setup_parent_component();


let heartIconDropdown = null;
let notif_triangle = null; 
let heart_icon = null;
let notif_light = null; 

test('testing useEffect for notifications component setting displays', async() => {
    expect(screen.queryByRole('listbox', {name: /holding notifications/})).toBe(null);
    expect(screen.queryByRole('navigation', {name: /enhance display/})).toBe(null);
});

test('testing document click listener added in navbar -- as it relates to notifications, clicking on heart icon', async() => {
    // should toggle approriately
    for (let i=0; i<7; i++) {
        if (i%2 === 1) {
            expect(screen.queryByRole('listbox', {name: /holding notifications/})).toBeInTheDocument(null);
            expect(screen.queryByRole('navigation', {name: /enhance display/})).toBeInTheDocument(null);
        }
        else {
            expect(screen.queryByRole('listbox', {name: /holding notifications/})).toBe(null);
            expect(screen.queryByRole('navigation', {name: /enhance display/})).toBe(null);
        }
        userEvent.click(screen.getByRole('button', {name: /heart icon/}));
    }
});

test('testing async useEffect -- new notifications light should be turned on by default', async() => {
    await waitFor(() => expect(screen.getByRole('navigation', {name: /light indicating/}))); 
})
