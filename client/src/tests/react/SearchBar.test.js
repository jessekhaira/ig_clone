import {SearchBar} from '../../components/LoggedInViews/NavBar/SearchBar';
import {searchBarBlurHelper} from '../../components/LoggedInViews/NavBar/NavBar';
import {rest} from 'msw';
import {setupServer} from 'msw/node'
import '@testing-library/jest-dom';
import * as React from 'react';
import {render,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const server = setupServer(
    rest.post('/loggedIn/navbar/search', (req, res, ctx) => {
      const return_array = [];
      for (let i =0 ; i<5; i++) {
          const object = {};
          object.username = `testing${i}`;
          object.full_name = `testing${i-1}`;
          object._id = `123123123`;
          object.profile_picture = ``
      }
      return res(ctx.json({ greeting: 'hello there' }))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


describe('testing synchronous event handlers in search bar component', () => {
    let search_bar = null;
    let inp_text_label = null; 
    let search_input_tag = null;
    let delete_inp_text_icon = null; 
    let search_dropdown_container = null;
    let search_triangle = null;
    let searchBarBlurMock = null;

    beforeEach(() => {
        searchBarBlurMock = jest.fn(() => {
            searchBarBlurHelper(); 
        });
        render(<SearchBar _searchBarBlur = {searchBarBlurMock}/>);
        search_bar = screen.getByRole('search', {name: /search bar/}); 
        inp_text_label = screen.getByText('Search');
        search_input_tag = screen.getByRole('textbox');
        delete_inp_text_icon = screen.getByRole('button', {name: /deletes/i});
        search_dropdown_container = screen.getByRole('search', {name: /search results/});
        search_triangle = screen.getByRole('search', {name: /triangle/});
    });

    test('test search bar click event handler when input tag is empty', () => {
        for (const obj of [inp_text_label, search_input_tag, delete_inp_text_icon]) {
            expect(obj.style.display).toEqual('');
        }

        userEvent.click(search_bar); 

        expect(inp_text_label.style.display).toEqual('none');
        expect(search_input_tag.style.display).toEqual('block');
        expect(delete_inp_text_icon.style.display).toEqual('block');

    });

    test('test search bar click event handler when input tag has a value', () => {
        search_input_tag.value = 'testing';

        console.log(search_dropdown_container);
        for (const obj of [search_dropdown_container, search_triangle]) {
            expect(obj.style.display).toEqual('');
        }

        userEvent.click(search_bar);
        
        for (const obj of [search_dropdown_container, search_triangle]) {
            expect(obj.style.display).toEqual('block');
        }
    });

    test('test click event handler on icon for deleting text in search bar', () => {
        userEvent.click(search_bar);

        search_input_tag.value = 'testing';

        userEvent.click(delete_inp_text_icon); 

        expect(searchBarBlurMock).toBeCalled();
        expect(search_input_tag.value).toEqual('');
        expect(inp_text_label.innerHTML).toEqual('Search');
        
        // test for search bar blur helper here as well -- since we just called the method in a logical spot it will be
        // used so makes sense to test here
        for (let [i,obj] of [search_dropdown_container, search_triangle, search_input_tag, inp_text_label, delete_inp_text_icon].entries()) {
            if (i !== 3) {
                expect(obj.style.display).toEqual('none');
            }
            else {
                expect(obj.style.display).toEqual('block');
            }
        }
    })
});


describe('testing async event handlers search bar', () => {
    test('testing async onChange event handler for search bar', async () => {
        // userEvent.type(screen.get)
    }); 
})