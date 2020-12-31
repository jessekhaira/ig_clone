import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {useHistory} from 'react-router-dom';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, normalizeCounts, setDisplay} from '../../../utility/utility_functions';

function UserProfileInformation (props) {
    const history = useHistory(); 
    const user_profile_viewing = history.location.pathname.split('/')[1];

    useEffect(() => {
        async function fetchInformation() {  
            await aysncCallToMountInformation();
        }
        fetchInformation(); 
    }); 

    async function aysncCallToMountInformation() {
        const spinner_div = document.getElementById('spinner_div_userprofiles');
        const user_not_found_container = document.getElementById('user_not_found_container');
        const resize_together_container = document.getElementById('resize_together_container');
        try {
            await checkTokenExpirationMiddleware(); 
            setDisplay(['block', 'none', 'none'], spinner_div, resize_together_container, user_not_found_container);
            const returned_profile_info_raw = await fetch(`/${user_profile_viewing}/profileInfo`, {
                method: 'GET',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 
            // need to know whether this user is following the current profile page they are looking at
            // to display the appropriate things 
            let user_following_currUser = false; 
            if (props.current_user !== user_profile_viewing) {
                const raw_data_userFollowsCurrUser = await fetch(`/${props.current_user}/${user_profile_viewing}`, {
                    method: 'GET',
                    headers: {
                        authorization: localStorage.getItem('accessToken')
                    }
                }); 
                const json_userFollowsCurrUser = await raw_data_userFollowsCurrUser.json(); 
                console.log(json_userFollowsCurrUser);
                user_following_currUser = json_userFollowsCurrUser.UserFollowingCurrUser; 
            }
            const returned_profile_info_json= await returned_profile_info_raw.json(); 
            if ("UnauthorizedUser" in returned_profile_info_json) {
                throw Error('UnauthorizedUser');
            }
            else if ("userNotFound" in returned_profile_info_json) {
                throw Error('userNotFound'); 
            }
            else {
                setDisplay(['none', 'block', 'none'], spinner_div, resize_together_container, user_not_found_container);
                fillInProfileWithInformation(returned_profile_info_json, user_following_currUser); 
            }
        }
        catch(err) {
            err = String(err);
            if(err.includes('UnauthorizedUser')) {
                _authenticationErrorLogOut();
            }
            else if(err.includes('userNotFound')) {
                setDisplay(['none', 'none', 'block'], spinner_div, resize_together_container, user_not_found_container);
            }
        }
    }

    function fillInProfileWithInformation(profileInfo, user_following_currUser) {
        if (!profileInfo || document.getElementById('profile_page_username_header') === null) {
            return; 
        }
        console.log(user_following_currUser);
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
        if(user_profile_viewing === props.current_user) {
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
            await checkTokenExpirationMiddleware(); 
            const follow_status_raw = await fetch(`/${current_user}/${following_user}`, {
                method: 'PUT',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 
            const follow_status_json = await follow_status_raw.json(); 
            console.log(follow_status_json); 
            if ("UnauthorizedUser" in follow_status_json) {
                throw Error('UnauthorizedUser');
            }
            await aysncCallToMountInformation(); 
            
        }
        catch(err) {
            err = String(err);
            if(err.includes('UnauthorizedUser')) {
                _authenticationErrorLogOut();
            }
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