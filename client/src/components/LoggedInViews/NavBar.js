import React from 'react'; 
import {Link} from "react-router-dom";
import {withRouter} from 'react-router-dom';

/**
 * This class represents a React Component that represents the navigation
 * bar of the application, which will be shown to the user when logged in. 
 * @class @public 
 */
class NavBar extends React.Component{
    constructor(props) {
        super(props); 

        this._logout = this._logout.bind(this); 
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

    _logout(e) {
        this.props.remove_curr_user(); 
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

                        <i id = "notifications" class="far fa-heart navbar_icons margin_class" ></i>
                        <div id = "profile_icon" className = "margin_class" onClick = {this._showProfileSettings}>
                            <img id = "profile_img" className = "options_imgs" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
                            <div id = "profile_settings">
                                <Link to = {`/${this.props.current_user}`}>
                                    <div id = "go_to_profile_div" className = "profile_settings_options">
                                        <div className = "profile_settings_icons">
                                            <img className = "icons_settings" src = "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png"></img>
                                        </div>
                                        <div className = "profile_settings_descr">
                                            <p>Profile</p>
                                        </div>
                                    </div>
                                </Link>

                                <div id = "saved_div" className = "profile_settings_options">
                                    <div className = "profile_settings_icons">
                                        <img className = "icons_settings" src = "https://image.flaticon.com/icons/png/512/2956/2956783.png"></img>
                                    </div>
                                    <div className = "profile_settings_descr">
                                        <p>Saved</p>
                                    </div>
                                </div>

                                <div id = "settings_div" className = "profile_settings_options">
                                    <div className = "profile_settings_icons">
                                        <img className = "icons_settings" src = "https://image.flaticon.com/icons/png/512/126/126472.png"></img>
                                    </div>
                                    <div className = "profile_settings_descr">
                                        <p>Settings</p>
                                    </div>
                                </div>

                                <div id = "switch_accounts_div" className = "profile_settings_options">
                                    <div className = "profile_settings_icons">
                                        <img className = "icons_settings" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Refresh_icon.svg/1200px-Refresh_icon.svg.png"></img>
                                    </div>
                                    <div className = "profile_settings_descr">
                                        <p>Switch Accounts</p>
                                    </div>
                                </div>

                                <hr id = "hr_settings"></hr>
                                <div id = "log_out_div" className = "profile_settings_options" onClick = {this._logout}>
                                    <div className = "profile_settings_descr logout">
                                        <p>Log Out</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}

const navbar_withrouter = withRouter(NavBar); 

export {navbar_withrouter as NavBar};  