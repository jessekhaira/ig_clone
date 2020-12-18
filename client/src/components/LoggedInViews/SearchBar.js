import React from 'react';
import {useEffect, useState} from 'react';
import {simulateSearchResults} from '../../utility/utility_functions';


function SearchBar(props) {
    function _searchBarFocus(e) {
        e.preventDefault();  
        const search_bar = document.getElementById('search_bar');
        const icon_input_div = document.getElementById('icon_input_div');
        document.getElementById('delete_inp_text_icon').style.display = 'block'; 
        // hide the div containing text, show the input tag
        const inp_tag = document.getElementById('search_input');
        inp_tag.style.display = 'block';
        inp_tag.focus(); 
        const inp_display_text = document.getElementById('inp_display_text');
        inp_display_text.style.display = 'none'; 
    }

    function _searchDelete(e) {
        e.preventDefault(); 
        e.stopPropagation(); 
        const search_bar = document.getElementById('search_bar');
        search_bar.blur(); 
        const inp_tag = document.getElementById('search_input');
        inp_tag.value = ''; 
    }

    async function _sendSearchRequest() {
        const input_tag = document.getElementById('search_input');
        if (input_tag.value.length > 0) {
            const search_results = await simulateSearchResults();
            addSearchResultDivs(search_results.searchResults); 
        }
    }

   return(
        <div id = "search_bar" onClick = {_searchBarFocus} onChange = {_sendSearchRequest}>
            <div id = "icon_input_div">
                <i class="fas fa-search search_icon"></i>
                <div id = "inp_display_text" >Search</div>
                <input id = "search_input" type = "text" placeholder = "Search"></input>
                <i id = "delete_inp_text_icon" class="fas fa-times-circle position_icon" onClick = {_searchDelete}></i>
            </div>
            <div id = "search_dropdown_container">
            </div>
            <div className = "top_triangle search_triangle"></div>
        </div>
   )
}


function addSearchResultDivs(search_results) {
    const search_dropdown_container = document.getElementById('search_dropdown_container');
    for (const search_result of search_results) {
        const div_containingResult = createSearchResDiv(search_result);
        search_dropdown_container.appendChild(div_containingResult);
        
        const hr_tag = document.createElement('hr');
        hr_tag.classList.add('notification_hr');

        search_dropdown_container.appendChild(div_containingResult);
        search_dropdown_container.appendChild(hr_tag);
    }
}

function createSearchResDiv(search_result) {
    function createSearchImgDiv() {
        const searchImgDiv = document.createElement('div');
        const imgDiv = document.createElement('img');

        imgDiv.src = search_result.user_profile_pic;
        imgDiv.classList.add('profile_img');
        imgDiv.classList.add('search_img');

        searchImgDiv.appendChild(imgDiv);
        return searchImgDiv; 
    }

    function createSearchRequestNamesDiv() {
        const search_names_div = document.createElement('div');
        search_names_div.classList.add('request_names');
        search_names_div.classList.add('search_req');

        const username = document.createElement('h3');
        username.innerHTML = search_result.username;
        const fullname = document.createElement('p');
        fullname.innerHTML = search_result.full_name;

        search_names_div.appendChild(username);
        search_names_div.appendChild(fullname);
        return search_names_div;
    }

    const searchContainer = document.createElement('div');
    searchContainer.classList.add('profile_img_names_container');
    searchContainer.classList.add('search_container');

    const searchImgDiv = createSearchImgDiv();
    const namesDiv = createSearchRequestNamesDiv(); 

    searchContainer.appendChild(searchImgDiv);
    searchContainer.appendChild(namesDiv);
    return searchContainer; 
}



export {SearchBar}; 