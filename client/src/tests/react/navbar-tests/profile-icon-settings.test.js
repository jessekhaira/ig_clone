import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setup_parent_component} from '../test-setup/logged-in-component-setup';

setup_parent_component();

let profile_img = null; 
let rootDivContainer = null; 
let logoutButton = null;

beforeEach(() => {
    profile_img = screen.getByAltText("profile img on navbar");
    rootDivContainer = screen.getByRole('navigation', {name: /overall container/}); 
})

test('testing useEffect on profile icon settings component responsible for getting image from server', async() => {
    await waitFor(() => expect(profile_img.src.length).toBeGreaterThan(1000));
    profile_img.src = 'testing';
    expect(profile_img.src).toBe('http://localhost/testing');
    await waitFor(() => expect(profile_img.src.length).toBeGreaterThan(1000));
});

test('testing document click listener in NavBar component as it relates to profile icon settings', () => {
    // should be toggling these elements appearing and disspearing appropriately
    // at the start, we also test that the profile icon settings component mounts correctly 
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


test('testing logout button on profile icon settings -- specifically props.remove_curr_user function', async () => {
    userEvent.click(rootDivContainer);
    // checking that JWTs are present before logging out, and not present after logging out 
    logoutButton = screen.getByRole('button', {name: "button used for logging out"});
    expect(localStorage.getItem('accessToken').length).toBeGreaterThan(10);
    expect(localStorage.getItem('refreshToken').length).toBeGreaterThan(10);
    expect(screen.queryByRole('link', {name: /go to testing123/})).toBeInTheDocument(); 

    userEvent.click(logoutButton);
    expect(localStorage.getItem('accessToken')).toBe(null);
    expect(localStorage.getItem('refreshToken')).toBe(null);
    expect(screen.queryByRole('link', {name: /go to testing123/})).toBe(null); 
})

