import {screen, wait, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setup_parent_component} from '../test-setup/logged-in-component-setup';

setup_parent_component();


let heartIconDropdown = null;
let notif_triangle = null; 
let heart_icon = null;
let notif_light = null; 
let follow_requests_container = null; 

test('testing useEffect for notifications component setting displays', async() => {
    expect(screen.queryByRole('listbox', {name: /holding notifications/})).toBe(null);
    expect(screen.queryByRole('navigation', {name: /enhance display/})).toBe(null);
});

test('testing async useEffect -- new notifications light should be turned on by default', async() => {
    await waitFor(() => expect(screen.getByRole('navigation', {name: /light indicating/}))); 
});

test(`testing document click listener added in navbar -- as it relates to notifications, clicking on heart icon, 
     ensuring that everything toggles appropriately`,
    async() => {
    // should toggle approriately
    for (let i=0; i<7; i++) {
        if (i%2 === 1) {
            expect(screen.queryByRole('listbox', {name: /holding notifications/})).toBeInTheDocument();
            expect(screen.queryByRole('navigation', {name: /enhance display/})).toBeInTheDocument();
            await waitFor(() => expect(screen.queryByRole('navigation', {name: /light indicating/})).toBe(null));
        }
        else {
            expect(screen.queryByRole('listbox', {name: /holding notifications/})).toBe(null);
            expect(screen.queryByRole('navigation', {name: /enhance display/})).toBe(null);
            await waitFor(() => expect(screen.queryByRole('navigation', {name: /light indicating/})).toBeInTheDocument()); 
        }
        userEvent.click(screen.getByRole('button', {name: /heart icon/}));
    }
});

test('testing onclick event handler fetch notifications', async() => {
    heart_icon = screen.getByRole('button', {name: /heart icon/});
    userEvent.click(heart_icon);
    await waitFor(() => expect(screen.queryByRole('listbox', {name: /notifications container/})).toBeInTheDocument());
    const notification_info = [
        ['1231213', 'liked your photo', '30s'], 
        ['user_2', '2d'], 
        ['user_12321321321321412518231931232130123891239123', '5m','commented: 123123213213213 12321 3123 21312 321 12 3123 0111010101100101 1010101101010101 101101010210101010101101010191919']
    ];

    for (let notif of notification_info) {
        for (let value of notif) {
            if (value.includes('liked')) {
                expect(screen.queryAllByText(value).length).toBeGreaterThan(0); 
            }
            else{
                expect(screen.queryByText(value)).toBeInTheDocument(); 
            }
        }
    }

})

