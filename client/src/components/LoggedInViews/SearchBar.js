import React from 'react';
import {useHistory} from 'react-router-dom';
import {simulateSearchResults1, simulateSearchResults2, simulateSearchResults3, setDisplay} from '../../utility/utility_functions';


function SearchBar(props) {
    function _clickOnSearchBar(e) {
        e.preventDefault();  
        const search_bar = document.getElementById('search_bar');
        const icon_input_div = document.getElementById('icon_input_div');
        const inp_tag = document.getElementById('search_input');
        const delete_inp_text_icon = document.getElementById('delete_inp_text_icon'); 
        const search_dropdown = document.getElementById('search_dropdown_container');
        const search_triangle = document.getElementsByClassName('search_triangle')[0];
        const inp_display_text = document.getElementById('inp_display_text');

        setDisplay(
            ['block', 'block', 'none'], inp_tag, delete_inp_text_icon, inp_display_text
        );

        if (inp_tag.value.length > 0) {
            setDisplay(
                ['block', 'block'], search_dropdown, search_triangle
            )
        }
        // hide the div containing text, show the input tag
        inp_tag.focus(); 
    }

    function _searchDelete(e) {
        e.preventDefault(); 
        e.stopPropagation(); 
        document.getElementById('navbar').click(); 
        document.getElementById('search_input').value = '';
        document.getElementById('inp_display_text').innerHTML = 'Search';

    }

    function addSearchResultDivs(search_results) {
        const search_dropdown_container = document.getElementById('search_dropdown_container');
        // edge case -- have to handle case where there are no search results at all 
        if (search_results.length === 0) {
            const no_results = document.createElement('div');
            no_results.classList.add('no_results_search');
            no_results.innerHTML = 'No results found.'; 
            search_dropdown_container.appendChild(no_results);
        }
        else {
            for (const [i,search_result] of search_results.entries()) {
                const div_containingResult = createSearchResDiv(search_result);
                console.log(i);
                if (i === 0) {
                    div_containingResult.classList.add('firstSearchResult');
                }
                search_dropdown_container.appendChild(div_containingResult);
    
            }
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
    
        searchContainer.addEventListener('click', _searchResultReRouteOnClick)
        return searchContainer; 
    }

    function _searchResultReRouteOnClick(e) {
        console.log(e.target);
    }
    

    async function _sendSearchRequest() {
        const input_tag = document.getElementById('search_input');
        const search_dropdown = document.getElementById('search_dropdown_container');
        const search_triangle = document.getElementsByClassName('search_triangle')[0];
        const delete_inp_text_icon = document.getElementById('delete_inp_text_icon');
        const spinner_div = document.getElementsByClassName('sk-chase-search-bar')[0];
        if (input_tag.value.length > 0) {
            try {
                setDisplay(['none', 'block', 'block', 'block'], delete_inp_text_icon, spinner_div, search_dropdown, search_triangle);
                let search_results = null;
                if (Math.random() >= 0.5) {
                    search_results = await simulateSearchResults3();
                }
                else {
                    search_results = await simulateSearchResults2(); 
                }
                // erase old search results and display new ones
                search_dropdown.textContent = ''; 
                addSearchResultDivs(search_results.searchResults); 
            }
            catch(err) {
                console.log(err);
            }
            finally {
                setDisplay(['block', 'none'], delete_inp_text_icon, spinner_div);
            }
        }
    }

   return(
        <div id = "search_bar" onClick = {_clickOnSearchBar} onChange = {_sendSearchRequest}>
            <div id = "icon_input_div">
                <i class="fas fa-search search_icon"></i>
                <div id = "inp_display_text" >Search</div>
                <input id = "search_input" type = "text" placeholder = "Search" autoComplete = "off"></input>
                <i id = "delete_inp_text_icon" class="fas fa-times-circle position_icon" onClick = {_searchDelete}></i>
            </div>
            <div id = "search_dropdown_container">
            </div>
            <div id = "spinner_div_notifications" className="sk-chase sk-chase-search-bar">
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
            </div>
            <div className = "top_triangle search_triangle"></div>
        </div>
   )
}


export {SearchBar}; 