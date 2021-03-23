import {server} from './server_setup';
import {LoggedInViews} from '../../../components/LoggedInViews/LoggedInViews';
import {render,screen, waitFor} from '@testing-library/react';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import {sign} from 'jsonwebtoken';
import '@testing-library/jest-dom';
import * as React from 'react';


function setup_parent_component() {

    beforeAll(() => server.listen());

    beforeEach(() => {
        const state = {
            current_user: {
                current_user: 'testing123'
            }
        }
        const mockStore = configureMockStore();
        const store = mockStore(state);

        const mock_access_token = sign({username: 'testing123'}, 'testing', {expiresIn: '20m'});
        const mock_refresh_token = sign({username: 'testing123'}, 'testing', {expiresIn: '20m'});
        localStorage.setItem('accessToken', mock_access_token);
        localStorage.setItem('refreshToken', mock_refresh_token);

        render(
            <Provider store = {store}>
                <LoggedInViews /> 
            </Provider>
        );
    });

    afterEach(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        server.resetHandlers();
    });

    afterAll(() => server.close());

}

export {setup_parent_component}; 
