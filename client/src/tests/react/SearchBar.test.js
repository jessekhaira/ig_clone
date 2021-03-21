import {SearchBar} from '../../components/LoggedInViews/NavBar/SearchBar';
import '@testing-library/jest-dom';
import * as React from 'react';
import {render, fireEvent,screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event'


describe('testing search bar component', () => {
    let search_bar = null;
    beforeAll(() => {
        render(<SearchBar />);
        search_bar = screen.getByRole('button', {name: /container/i});
    });

    test('test search bar click event handler when input tag is empty', () => {
        const inp_text_label = screen.getByText(/search/i);
        const search_input_tag = screen.getByRole('textbox');
        const delete_inp_text_icon = screen.getByRole('button', {name: /deletes/i});

        for (const [i, obj] of [inp_text_label, search_input_tag, delete_inp_text_icon].entries()) {
            expect(obj.style.display).toEqual('');
        }

        userEvent.click(search_bar); 

        expect(inp_text_label.style.display).toEqual('none');
        expect(search_input_tag.style.display).toEqual('block');
        expect(delete_inp_text_icon.style.display).toEqual('block');
    })
})