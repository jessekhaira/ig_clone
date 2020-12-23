import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import {_authenticationErrorLogOut, checkTokenExpirationMiddleware} from '../../utility/utility_functions'; 

function ProfileIconSettings(props) {
    function _logout() {
        props.remove_curr_user(); 
    }

    const [firstTimeMounted, setFirstTimeMounted] = useState(true); 

    useEffect(async () => {
        if (firstTimeMounted === true) {
            document.getElementById('profile_settings').style.display = 'none'; 
            document.getElementsByClassName('profile_triangle')[0].style.display = 'none'; 
            setFirstTimeMounted(false);
        }
    });

    useEffect(async () => {
        // before any request to a protected endpoint we check if our access token is expired and if it is
        // refresh it 
        try {
            await checkTokenExpirationMiddleware(); 
            console.log(props.current_user); 
            const profile_icon_raw = await fetch(`/${props.current_user}/profilePhoto`, {
                method: 'get', 
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            });
            const profile_icon_json = await profile_icon_raw.json();
            console.log(profile_icon_json);
            const base64_image = 'data:image/jpeg;base64,' + profile_icon_json.profile_picture[0].profile_picture;
            const profile_img = document.getElementById('profile_img'); 
            if (base64_image !== profile_img.src) {
                profile_img.src = base64_image; 
            } 
        }
        catch(err) {
            err = String(err);
            // when page refreshes, we get a failed to fetch produced by react even though everything
            // is fetched -- don't know why, just ignoring it for now 
            if (!err.includes('Failed to fetch')) {
                _authenticationErrorLogOut(); 
            }
        }
    })

    return(
        <div id = "profile_icon" className = "margin_class">
            <img id = "profile_img" className = "options_imgs"></img>
            <div className = "top_triangle profile_triangle"></div>
            <div id = "profile_settings">
                <Link to = {`/${props.current_user}`}>
                    <div id = "go_to_profile_div" className = "profile_settings_options">
                        <div className = "profile_settings_icons">
                            <img alt = "Default Profile Figure" className = "icons_settings" src = "https://i.pinimg.com/originals/0c/3b/3a/0c3b3adb1a7530892e55ef36d3be6cb8.png"></img>
                        </div>
                        <div className = "profile_settings_descr">
                            <p>Profile</p>
                        </div>
                    </div>
                </Link>

                <div id = "saved_div" className = "profile_settings_options">
                    <div className = "profile_settings_icons">
                        <img alt = "Saved Figure" className = "icons_settings" src = "https://cdn2.iconfinder.com/data/icons/electronic-line-3/64/Bookmark_favourite_pin_saved_interface_icon-512.png"></img>
                    </div>
                    <div className = "profile_settings_descr">
                        <p>Saved</p>
                    </div>
                </div>

                <div id = "settings_div" className = "profile_settings_options">
                    <div className = "profile_settings_icons">
                        <img alt = "Settings Wheel" className = "icons_settings" src = "https://image.flaticon.com/icons/png/512/126/126472.png"></img>
                    </div>
                    <div className = "profile_settings_descr">
                        <p>Settings</p>
                    </div>
                </div>

                <div id = "switch_accounts_div" className = "profile_settings_options">
                    <div className = "profile_settings_icons">
                        <img alt = "Account Switch" className = "icons_settings" src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Refresh_icon.svg/1200px-Refresh_icon.svg.png"></img>
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