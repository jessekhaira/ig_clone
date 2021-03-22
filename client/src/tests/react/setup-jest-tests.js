import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {readFileSync} from 'fs';
import '@testing-library/jest-dom';
import * as React from 'react';

const server = setupServer(
    rest.post('/loggedIn/navbar/search', (req, res, ctx) => {
        const return_array = [];
        for (let i =0 ; i<5; i++) {
            const object = {};
            object.username = `testing${i}`;
            object.full_name = `testing${i+50}`;
            object._id = `123123123`;
            object.profile_picture = readFileSync(__dirname + '/generic_profile_pic.jpg', {encoding: 'base64'}); 
            return_array.push(object);
        }
        
        return res(ctx.json({searchResults: return_array}));
    })
);

function setup_test() {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
}

export {setup_test} 
