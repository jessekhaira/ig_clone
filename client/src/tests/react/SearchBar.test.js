import { act } from "react-dom/test-utils";
import {SearchBar} from '../../components/LoggedInViews/NavBar/SearchBar';
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

let container = null;
let search_bar_element = null;
beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    act(() => {
        render(<SearchBar />, container);
    });
    search_bar_element = document.getElementById('search_bar');
});

afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
})

describe('group of tests testing search bar component', () => {

    test('test on click event handler for search bar -- when input tag value == 0 (ie nothing typed in)', async () => {
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

        expect(inp_tag.contains(document.activeElement)).toEqual(true); 
    });

    test('test on click event handler for search bar -- when input tag value length > 0 ', async () => {
        const inp_tag = search_bar_element.querySelector('#search_input'); 
        const search_dropdown_container = search_bar_element.querySelector('#search_dropdown_container');
        const search_triangle = search_bar_element.querySelector('.search_triangle');

        inp_tag.value = 'testing'; 

        expect(search_dropdown_container.style.display).toEqual('');
        expect(search_triangle.style.display).toEqual('');

        act(() => {
            search_bar_element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(search_dropdown_container.style.display).toEqual('block');
        expect(search_triangle.style.display).toEqual('block'); 
    });




});