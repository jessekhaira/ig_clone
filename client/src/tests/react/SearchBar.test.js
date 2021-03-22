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
    test('test search bar click event handler when input tag is empty', () => {
        render(<SearchBar />);
        let search_bar = screen.getByRole('search', {name: /search bar/}); 
        const inp_text_label = screen.getByText('Search');
        const search_input_tag = screen.getByRole('textbox');
        const delete_inp_text_icon = screen.getByRole('button', {name: /deletes/i});

        for (const obj of [inp_text_label, search_input_tag, delete_inp_text_icon]) {
            expect(obj.style.display).toEqual('');
        }

        userEvent.click(search_bar); 

        expect(inp_text_label.style.display).toEqual('none');
        expect(search_input_tag.style.display).toEqual('block');
        expect(delete_inp_text_icon.style.display).toEqual('block');

    });

    test('test search bar click event handler when input tag has a value', () => {
        render(<SearchBar />);
        let search_bar = screen.getByRole('search', {name: /search bar/}); 
        const search_input_tag = screen.getByRole('textbox');
        search_input_tag.value = 'testing';

        const search_dropdown_container = screen.getByRole('search', {name: /search results/}); 
        const search_triangle = screen.getByRole('search', {name: /triangle/});

        for (const obj of [search_dropdown_container, search_triangle]) {
            expect(obj.style.display).toEqual('');
        }

        userEvent.click(search_bar);
        
        for (const obj of [search_dropdown_container, search_triangle]) {
            expect(obj.style.display).toEqual('block');
        }
    });

    test('test click event handler on icon for deleting text in search bar', () => {
        const searchBarBlurMock = jest.fn(() => {
            searchBarBlurHelper(); 
        });
        render(<SearchBar _searchBarBlur = {searchBarBlurMock}/>);
        userEvent.click(search_bar);

        const search_input_tag = screen.getByRole('textbox');
        search_input_tag.value = 'testing';
        const delete_inp_text_icon = screen.getByRole('button', {name: /deletes/i});
        const inp_text_label = screen.getByText('Search');
        const search_dropdown_container = screen.getByRole('search', {name: /search results/}); 
        const search_triangle = screen.getByRole('search', {name: /triangle/});


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
        
    }); 
})