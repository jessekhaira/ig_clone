import React from 'react';
import {Link} from "react-router-dom";

function ProfileIconSettings(props) {
    function _logout() {
        props.remove_curr_user(); 
    }

    function _showProfileSettings(e) {
        props._setLocalStorageHighlight(e); 
        e.preventDefault();
        const profile_settings = document.getElementById('profile_settings');
        const bubble = document.getElementsByClassName('top_triangle')[0];
        bubble.style.display = bubble.style.display === 'block' ? 'none': 'block'; 
        profile_settings.style.display = (profile_settings.style.display === 'block' ? 'none':'block');
    }

    return(
        <div id = "profile_icon" className = "margin_class" onClick = {_showProfileSettings}>
            <img id = "profile_img" className = "options_imgs" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            <div className = "top_triangle profile_triangle"></div>
            <div id = "profile_settings">
                <Link to = {`/${props.current_user}`}>
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
                        <img className = "icons_settings" src = "https://cdn2.iconfinder.com/data/icons/electronic-line-3/64/Bookmark_favourite_pin_saved_interface_icon-512.png"></img>
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
                <div id = "log_out_div" className = "profile_settings_options" onClick = {_logout}>
                    <div className = "profile_settings_descr logout">
                        <p>Log Out</p>
                    </div>
                </div>
            </div>
        </div>
    )
}


export {ProfileIconSettings}; 