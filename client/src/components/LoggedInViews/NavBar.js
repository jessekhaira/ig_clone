import React from 'react'; 
import {Link} from "react-router-dom";
import {withRouter} from 'react-router-dom';
import {ProfileIconSettings} from './ProfileIconSettings';
import {Notifications} from './Notifications';

/**
 * This class represents a React Component that represents the navigation
 * bar of the application, which will be shown to the user when logged in. 
 * @class @public 
 */
class NavBar extends React.Component{
    constructor(props) {
        super(props); 
        this._documentClickListener = this._documentClickListener.bind(this);
    }

    componentDidMount() {
        document.getElementById('profile_settings').style.display = 'none'; 
        document.addEventListener('click', this._documentClickListener);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._documentClickListener); 
    }

    _documentClickListener(e) {
        if (e.target.id !== 'profile_icon' && e.target.id !== 'profile_img' ) {
            document.getElementById('profile_settings').style.display = 'none'; 
        }
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

    render() {
        return(
            <div id = "navbar_container">
                <nav id = "navbar">
                    <Link to = '/'>
                        <div id = "ig_name">
                            <h1 className = "instagram_name">Instagram Clone</h1>
                        </div>
                    </Link>
                    
                    <div id = "search_bar" onMouseDown = {this._searchBarFocus} onBlur = {this._searchBarBlur}>
                        <div id = "icon_input_div">
                            <i class="fas fa-search search_icon"></i>
                            <div id = "inp_display_text" >Search</div>
                            <input id = "search_input" type = "text" placeholder = "Search"></input>
                            <i id = "delete_inp_text_icon" class="fas fa-times-circle position_icon" onClick = {this._searchDelete}></i>
                        </div>
                    </div>

                    <div id = "navbar_options">
                        <Link to = "/">
                            <i id = "home_icon" className="fas fa-home navbar_icons margin_class"></i>
                        </Link>

                        <Link to = "/direct/inbox/">
                            <img id = "dm_icon" className = "options_imgs margin_class" src = "https://static.thenounproject.com/png/3084968-200.png"></img>
                        </Link>
                       
                        <Link to = "/explore">
                            <i id = "explore"class="far fa-compass navbar_icons margin_class"></i>
                        </Link>

                        <Notifications />
                        <ProfileIconSettings 
                            remove_curr_user = {this.props.remove_curr_user}
                            current_user = {this.props.current_user} />
                    </div>
                </nav>
            </div>
        )
    }
}

const navbar_withrouter = withRouter(NavBar); 

export {navbar_withrouter as NavBar};  