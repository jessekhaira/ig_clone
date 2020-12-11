import React from 'react'; 
import {Link} from "react-router-dom";


class NavBar extends React.Component{
    constructor(props) {
        super(props); 

        this._redirectParentContainer = this._redirectParentContainer.bind(this); 
    }
    
    componentDidMount() {

    }

    _searchBarFocus(e) {
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

    _searchBarBlur(e) {
        e.preventDefault(); 
        const search_bar = document.getElementById('search_bar');
        const icon_input_div = document.getElementById('icon_input_div');
        search_bar.style.justifyContent = 'center';
        icon_input_div.style.justifyContent = 'center';
        document.getElementById('delete_inp_text_icon').style.display = 'none'; 
        const inp_tag = document.getElementById('search_input');
        inp_tag.style.display = 'none';
        const inp_display_text = document.getElementById('inp_display_text');
        inp_display_text.style.display = 'block'; 
        inp_display_text.innerHTML = (inp_tag.value ? inp_tag.value: "Search"); 
    }

    _searchDelete(e) {
        e.preventDefault(); 
        e.stopPropagation(); 
        const search_bar = document.getElementById('search_bar');
        search_bar.blur(); 
        const inp_tag = document.getElementById('search_input');
        inp_tag.value = ''; 
    }

    _redirectParentContainer(e) {
        this.props._changeInEndpoint_ReRenderViews('/home'); 
    }


    render() {
        return(
            <nav id = "navbar">
                <div id = "ig_name">
                    <h1 className = "instagram_name">Instagram Clone</h1>
                </div>

                <div id = "search_bar" onMouseDown = {this._searchBarFocus} onBlur = {this._searchBarBlur}>
                    <div id = "icon_input_div">
                        <i class="fas fa-search search_icon"></i>
                        <div id = "inp_display_text" >Search</div>
                        <input id = "search_input" type = "text" placeholder = "Search"></input>
                        <i id = "delete_inp_text_icon" class="fas fa-times-circle position_icon" onClick = {this._searchDelete}></i>
                    </div>
                </div>

                <div id = "navbar_options">

                    <i id = "home_icon" className="fas fa-home navbar_icons margin_class" onClick = {this._redirectParentContainer}></i>
                    <img id = "dm_icon" onClick = {this._redirectParentContainer} className = "options_imgs margin_class" src = "https://static.thenounproject.com/png/3084968-200.png"></img>
                    <i class="far fa-compass navbar_icons margin_class" onClick = {this._redirectParentContainer}></i>
                    <i class="far fa-heart navbar_icons margin_class" onClick = {this._redirectParentContainer}></i>
                    <div id = "profile_icon" className = "margin_class">
                        <img id = "profile_img" onClick = {this._redirectParentContainer} className = "options_imgs" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
                    </div>
                </div>
            </nav>
        )
    }
}

export {NavBar}; 