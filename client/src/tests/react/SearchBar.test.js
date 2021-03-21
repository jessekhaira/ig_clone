import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import {SearchBar} from '../../components/LoggedInViews/NavBar/SearchBar';


let container = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
        render(<SearchBar />, container);
    });
});
  
afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

describe('group of tests testing search bar component', () => {

    test('test on click event handler for search bar -- changing elements views appropriately', async () => {
        const search_bar_element = document.getElementById('search_bar');
        const inp_tag = search_bar_element.querySelector('#search_input'); 
        const delete_inp_text_icon = search_bar_element.querySelector('#delete_inp_text_icon');
        const inp_display_text = search_bar_element.querySelector('#inp_display_text');
        expect(inp_tag.style.display).toEqual('');
        expect(delete_inp_text_icon.style.display).toEqual('');
        expect(inp_display_text.style.display).toEqual('');

        act(() => {
            search_bar_element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(inp_tag.style.display).toEqual('block');
        expect(delete_inp_text_icon.style.display).toEqual('block');
        expect(inp_display_text.style.display).toEqual('none');
    });

});