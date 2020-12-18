import React from 'react';
import {useEffect, useState} from 'react';



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
                <div className = "profile_img_names_container search_container">
                    <div id = "search_img">
                        <img className = "profile_img search_img" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
                    </div>
                    <div className = "request_names search_req">
                        <h3>user_1232132132132141251823193123213012312321312312312312321312891239123</h3>
                        <p>user_1232132132132141251823193123213012312321312312312312321312891239123</p>
                    </div>
                </div>
            </div>
            <div className = "top_triangle search_triangle"></div>
        </div>
   )
}
export {SearchBar}; 