import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {useHistory} from 'react-router-dom';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';


function UserProfileInformation (props) {
    const history = useHistory(); 
    useEffect(() => {
        async function fetchInformation() {  
            const username_belongingto_profile = history.location.pathname.split('/')[1];
            const profileInfo = await props.aysncCallToMountInformation('/profileInfo', username_belongingto_profile); 
            fillInProfileWithInformation(profileInfo); 
        }
        fetchInformation(); 
    }); 

    function fillInProfileWithInformation(profileInfo) {
        if (!profileInfo) {
            return; 
        }
        document.getElementById('profile_page_username').innerHTML = profileInfo.username; 
        document.getElementById('fullname_profile').innerHTML = profileInfo.full_name;
        document.getElementById('post_count').innerHTML = profileInfo.number_posts;
        document.getElementById('follower_count').innerHTML = profileInfo.number_followers;
        document.getElementById('following_count').innerHTML = profileInfo.number_following; 
        document.getElementById('profile_page_profpic').src = 'data:image/jpeg;base64,' + profileInfo.profile_picture.profile_picture;
    }

    return (
        <div id = "user_profile_info_container">
            <div id = "profile_page_profpic_divcontainer">
                <img id = "profile_page_profpic"></img>
            </div>
            <div id = "profile_info_directparentdiv">
                <div id = "name_options_divcontainer">
                    <div id = "profile_page_username" className = "options_item">
                        <h2 id = "profile_page_username" ></h2>
                    </div>
                    <button id = "edit_profile" className = "options_item">
                        Edit Profile
                    </button>
                    <img id = "profilepg_settingicon" alt = "Settings Wheel" className = "icons_settings options_item" src = "https://image.flaticon.com/icons/png/512/126/126472.png"></img>
                </div>
                <div id = "meta_info_user_normalviewport">
                    <div id = "post_info_div" className = "meta_info_user_divcontainer">
                        <p id = "post_count" className = "post_info_counts"></p>
                        <p className = "post_info_descr">posts</p>
                    </div>
                    <div id = "follower_info_div" className = "meta_info_user_divcontainer">
                        <p id = "follower_count" className = "post_info_counts"></p>
                        <p className = "post_info_descr">followers</p>
                    </div>
                    <div id = "following_info_div" className = "meta_info_user_divcontainer">
                        <p id = "following_count" className = "post_info_counts"></p>
                        <p className = "post_info_descr">following</p>
                    </div>
                </div>
                <div id = "profile_info_bio">
                    <p id = "fullname_profile"></p>
                    <p id = "editable_bio_info">
                        Superhero
                        Justice League
                        Galaxy
                    </p>
                </div>
            </div>
        </div>
    )
}

export {UserProfileInformation}; 