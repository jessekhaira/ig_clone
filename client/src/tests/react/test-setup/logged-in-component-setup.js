import {server} from './server_setup';
import {LoggedInViews} from '../../../components/LoggedInViews/LoggedInViews';
import {render,screen, waitFor} from '@testing-library/react';
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import {sign} from 'jsonwebtoken';
import '@testing-library/jest-dom';
import * as React from 'react';
import thunk from 'redux-thunk';
import {removeCurrUser} from '../../../redux/customMiddleware';

const middlewares = [removeCurrUser, thunk];

function setup_parent_component(sendBackErrorsAPITests=false) {

    beforeAll(() => {
        server.listen()
    });

    beforeEach(() => {
        const state = {
            current_user: {
                current_user: 'testing123'
            }
        }

        localStorage.clear(); 
        const mockStore = configureMockStore(middlewares);
        const store = mockStore(state);

        let mock_access_token = null;
        let mock_refresh_token = null; 
        if (!(sendBackErrorsAPITests)) {
            mock_access_token = sign({username: 'testing123'}, 'testing', {expiresIn: '20m'});
            mock_refresh_token = sign({username: 'testing123'}, 'testing', {expiresIn: '20m'});
        }
        else {
            mock_access_token = sign({username: 'error123'}, 'testing', {expiresIn: '20m'});
            mock_refresh_token = sign({username: 'error123'}, 'testing', {expiresIn: '20m'});
        }

        localStorage.setItem('accessToken', mock_access_token);
        localStorage.setItem('refreshToken', mock_refresh_token);

        render(
            <Provider store = {store}>
                <LoggedInViews /> 
            </Provider>
        );
    });

    afterEach(() => {
        localStorage.clear(); 
        server.resetHandlers();
    });

    afterAll(() => {
        localStorage.clear(); 
        server.close()
    });

}

export {setup_parent_component}; 
