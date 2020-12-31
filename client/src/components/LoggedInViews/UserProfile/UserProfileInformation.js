import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {useHistory} from 'react-router-dom';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, normalizeCounts, setDisplay} from '../../../utility/utility_functions';

function UserProfileInformation (props) {
    const history = useHistory(); 
    useEffect(() => {
        async function fetchInformation() {  
            const username_belongingto_profile = history.location.pathname.split('/')[1];
            const profileInfo = await props.aysncCallToMountInformation('/profileInfo', username_belongingto_profile, 'GET', null); 
            fillInProfileWithInformation(profileInfo); 
        }
        fetchInformation(); 
    }); 

    function fillInProfileWithInformation(profileInfo) {
        if (!profileInfo) {
            return; 
        }
        else if (document.getElementById('profile_page_username_header') === null) {
            return; 
        }
        const num_posts = profileInfo.number_posts;
        const num_followers = profileInfo.number_followers;
        const num_following = profileInfo.number_following; 
        document.getElementById('profile_page_username_header').innerHTML = profileInfo.username;
        document.getElementById('fullname_profile').innerHTML = profileInfo.full_name;
        const [normalized_num_posts, normalized_num_followers, normalized_num_following] = normalizeCounts(num_posts, num_followers, num_following);
        document.getElementById('post_count').innerHTML = normalized_num_posts;
        document.getElementById('editable_bio_info').innerHTML = profileInfo.profile_description;
        document.getElementById('follower_count').innerHTML = normalized_num_followers;
        document.getElementById('following_count').innerHTML = normalized_num_following; 
        document.getElementById('profile_page_profpic').src = 'data:image/jpeg;base64,' + profileInfo.profile_picture.profile_picture;
        
        // need to decide which buttons to show the user depending on the endpoint
        const own_profile_options = document.getElementById('own_profile_options');
        const other_profile_options = document.getElementById('other_profile_options');
        if(history.location.pathname.split('/')[1] === props.current_user) {
            setDisplay(['none', 'flex'], other_profile_options, own_profile_options);
        }
        else {
            setDisplay(['flex', 'none'], other_profile_options, own_profile_options);
        }
    }

    function showEditProfile() {
        history.push(`${history.location.pathname}/editProfile`)
    }

    async function followUser(e) {
        try {
            const current_user = props.current_user; 
            const following_user = history.location.pathname.split('/')[1];

        }
        catch(err) {

        }
    }

    return (
        <div id = "user_profile_info_container">
            <div id = "profile_page_profpic_divcontainer">
                <img id = "profile_page_profpic"></img>
            </div>
            <div id = "profile_info_directparentdiv">
                <div id = "name_options_divcontainer">
                    <div id = "profile_page_username" className = "options_item">
                        <h2 id = "profile_page_username_header" ></h2>
                    </div>
                    <div id = "other_profile_options">
                        <button id = "message_user" className = "options_item followed">
                            Message
                        </button>
                        <button id = "follow_user" className = "options_item" onClick = {followUser}>
                            Follow
                        </button>
                        <div className = "arrow_tip_down options_item"></div>
                        <i id = "three_dots_options" className = "fas fa-ellipsis-h options_item"></i>
                    </div>
                    <div id = "own_profile_options">
                        <button id = "edit_profile" className = "options_item" onClick = {showEditProfile}>
                            Edit Profile
                        </button>
                        <img id = "profilepg_settingicon" alt = "Settings Wheel" className = "icons_settings options_item" src = "https://image.flaticon.com/icons/png/512/126/126472.png"></img>
                    </div>
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