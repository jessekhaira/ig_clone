import {rest} from 'msw';
import {setupServer} from 'msw/node';
import {createArrayUserObjects, getProfileImageBase64Encoded} from './user-seed';

const server = setupServer(
    rest.post('/loggedIn/navbar/search', (req, res, ctx) => {
        const search_query = req.body.search_query;
        // indicates we are testing to make sure results are filled into search container appropriately
        if (search_query.includes('t')) {
            const return_array = createArrayUserObjects(); 
            return res(ctx.json({searchResults: return_array}));
        }
        // indicates we are testing to make sure appropriate display when server returns 0 results
        else if (search_query.includes('z')) {
            return res(ctx.json({searchResults: []}));
        }
        // deal with error case 
        else {
            return res(ctx.json({error: 'test_failure'}));
        }
    }),

    rest.get('/testing123/profilePhoto', (req, res, ctx) => {
        const prof_pic = getProfileImageBase64Encoded(); 
        const return_obj = {profile_picture: [{profile_picture: prof_pic}]};
        return res(ctx.json(return_obj)); 
    }), 

    rest.get('/*', (req, res, ctx) => {
        return res(ctx.json({error: 'xd'}));
    })
);


export {server} 
