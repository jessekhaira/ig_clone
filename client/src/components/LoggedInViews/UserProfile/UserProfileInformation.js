import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {useHistory} from 'react-router-dom';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, normalizeCounts} from '../../../utility/utility_functions';

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
        else if (document.getElementById('profile_page_username') === null) {
            return; 
        }
        const num_posts = profileInfo.number_posts;
        const num_followers = profileInfo.number_followers;
        const num_following = profileInfo.number_following; 
        document.getElementById('profile_page_username').innerHTML = profileInfo.username; 
        document.getElementById('fullname_profile').innerHTML = profileInfo.full_name;
        const [normalized_num_posts, normalized_num_followers, normalized_num_following] = normalizeCounts(num_posts, num_followers, num_following);
        document.getElementById('post_count').innerHTML = normalized_num_posts;
        document.getElementById('editable_bio_info').innerHTML = profileInfo.profile_description;
        document.getElementById('follower_count').innerHTML = normalized_num_followers;
        document.getElementById('following_count').innerHTML = normalized_num_following; 
        document.getElementById('profile_page_profpic').src = 'data:image/jpeg;base64,' + profileInfo.profile_picture.profile_picture;
    }

    function showEditProfile() {
        history.push(`${history.location.pathname}/editProfile`)
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
                    <button id = "edit_profile" className = "options_item" onClick = {showEditProfile}>
                        Edit Profile
                    </button>
                    <button id = "follow_user" className = "options_item">Follow Profile</button>
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
                    <pre id = "editable_bio_info">
                    </pre>
                </div>
            </div>
        </div>
    )
}

export {UserProfileInformation}; 