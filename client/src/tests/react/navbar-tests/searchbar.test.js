import {SearchBar} from '../../../components/LoggedInViews/NavBar/SearchBar';
import {setup_test} from '../test-setup/setup-jest-tests';
import {render,screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

let search_bar = null;
let inp_text_label = null; 
let search_input_tag = null;
let delete_inp_text_icon = null; 
let search_dropdown_container = null;
let search_triangle = null;
let searchBarBlurMock = null;
let spinner_holder = null;

setup_test();


beforeEach(() => {
    searchBarBlurMock = jest.fn(); 
    render(<SearchBar _searchBarBlur = {searchBarBlurMock}/>);
    search_bar = screen.getByRole('search', {name: /search bar/}); 
    inp_text_label = screen.getByText('Search');
    search_input_tag = screen.getByRole('textbox');
    delete_inp_text_icon = screen.getByRole('button', {name: /deletes/i});
    search_dropdown_container = screen.getByRole('search', {name: /search results/});
    search_triangle = screen.getByRole('search', {name: /triangle/});
    spinner_holder = screen.getByRole('search', {name: /spinner container/});
});


describe('testing synchronous event handlers in search bar component', (done) => {
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

        expect(searchBarBlurMock).toHaveBeenCalledTimes(1);
        expect(search_input_tag.value).toEqual('');
        expect(inp_text_label.innerHTML).toEqual('Search');
        
    });

});

describe('testing async functions, and things related to async functions in search bar component', () => {
    test('testing async onChange event handler for search bar when results are returned', async () => {
        // have to run test twice since our results shouldn't be stacking on top of each other in the
        // search dropdown container
        for (let j=0; j<2;j++) {
            // clear textbox before running
            screen.getByRole('textbox').value = ''; 
            userEvent.type(screen.getByRole('textbox'), 'tttt');
            // thread sleep to allow DOM to update 
            await new Promise(r => setTimeout(r, 500));
            let i = 0;
            expect(search_dropdown_container.children.length).toEqual(5);
            for (const child of search_dropdown_container.children) {
                if (i === 0) {
                    expect(child.classList.contains('firstSearchResult')).toEqual(true);
                }
                expect(child.children.length).toEqual(2);
                // make sure username, fullname, and profile picture are inserted appropriately into 
                // the search resuts
                expect(screen.getByText(`testing${i}`)).toBeInTheDocument();
                expect(screen.getByText(`testing${i+50}`)).toBeInTheDocument();
                const images = search_dropdown_container.querySelectorAll('img'); 
                expect(images.length).toEqual(5); 
                for (let img of images) {
                    expect(img.src.length).toBeGreaterThan(0); 
                }
                i++;
            }
            
            expect(delete_inp_text_icon.style.display).toEqual('block');
            expect(spinner_holder.style.display).toEqual('none');
        }
    }); 

    test('testing async onChange event handler for search bar when there are no results', async () => {
        for (let j=0; j<2;j++) {
            // clear textbox before running
            screen.getByRole('textbox').value = ''; 
            userEvent.type(screen.getByRole('textbox'), 'zzzzz');
            await waitFor(() => expect(screen.getByText(/No results/)).toBeInTheDocument());
            expect(search_dropdown_container.children.length).toEqual(1);
        }
    })
}); 