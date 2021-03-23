import {screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {setup_parent_component} from '../test-setup/logged-in-component-setup';
import { MemoryRouter } from 'react-router-dom';

setup_parent_component(); 
let profile_settings_container_div = null;
let profile_triangle = null; 

test('test to make sure before we click on the profile icon, no settings appear', () => {
    expect(screen.queryByRole('navigation', {name: /arrow tip/})).toBe(null);
    expect(screen.queryByRole('navigation', {name: /all profile settings/})).toBe(null);
});

describe('', () => {

    test('testing if profile icon settings mounted correctly', () => {
    })
})