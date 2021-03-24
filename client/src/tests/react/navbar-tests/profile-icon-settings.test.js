import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setup_parent_component} from '../test-setup/logged-in-component-setup';
import { MemoryRouter } from 'react-router-dom';

setup_parent_component();

let profile_settings_container_div = null;
let profile_triangle = null; 
let profile_img = null; 
let rootDivContainer = null; 


test('testing that image loads correctly into profile_img when component mounts', async() => {
    profile_img = screen.getByAltText(/navbar/);
    await waitFor(() => expect(profile_img.src.length).toBeGreaterThan(1000));
});

test('testing document click listener in NavBar component as it relates to profile icon settings', () => {
    // should be toggling these elements appearing and disspearing appropriately
    // at the start, we also test that the profile icon settings component mounts correctly 
    rootDivContainer = screen.getByRole('navigation', {name: /overall container/}); 

    for (let i=0; i<7; i++) {
        if (i%2 === 0) {
            expect(screen.queryByRole('navigation', {name: /arrow tip/})).toBe(null);
            expect(screen.queryByRole('navigation', {name: /all profile settings/})).toBe(null);
        }
        else {
            expect(screen.queryByRole('navigation', {name: /arrow tip/})).toBeInTheDocument();
            expect(screen.queryByRole('navigation', {name: /all profile settings/})).toBe(null);
        }
        userEvent.click(rootDivContainer);
    }
});
