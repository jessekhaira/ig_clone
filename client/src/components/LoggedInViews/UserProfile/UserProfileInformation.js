import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {useHistory} from 'react-router-dom';
import {FollowBox} from './FollowBox';
import {FollowingBox} from './FollowingBox';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, normalizeCounts, setDisplay, darkenBackground, lightenBackground} from '../../../utility/utility_functions';

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
                const raw_data_userFollowsCurrUser = await fetch(`/${props.current_user}/follow/${user_profile_viewing}`, {
                    method: 'GET',
                    headers: {
                        authorization: localStorage.getItem('accessToken')
                    }
                }); 
                const json_userFollowsCurrUser = await raw_data_userFollowsCurrUser.json(); 
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
        console.log(user_following_currUser); 
        if (user_following_currUser === 'true') {
            followingUserStyles(); 
        }
        else {
            notFollowingUserStyles(); 
        }
    }

    function followingUserStyles() {
        document.getElementById('follow_user').classList.add('following_user');
        const arrow_tip_down = document.getElementById('options_profile_arrowdown');
        arrow_tip_down.classList.add('following_user');
        arrow_tip_down.style.color = 'black';
        const message_user = document.getElementById('message_user');
        const follow_descr = document.getElementById('follow_descr'); 
        const profile_icon_follow = document.getElementById('follow_icon_profile');
        const checkmark_icon_follow = document.getElementById('follow_icon_checkmark');
        setDisplay(['block', 'none', 'inline', 'inline'], message_user, follow_descr, profile_icon_follow, checkmark_icon_follow); 
    }

    function notFollowingUserStyles() {
        document.getElementById('follow_user').classList.remove('following_user');
        const arrow_tip_down = document.getElementById('options_profile_arrowdown');
        arrow_tip_down.classList.remove('following_user');
        arrow_tip_down.style.color = 'white';
        const message_user = document.getElementById('message_user');
        const follow_descr = document.getElementById('follow_descr'); 
        const profile_icon_follow = document.getElementById('follow_icon_profile');
        const checkmark_icon_follow = document.getElementById('follow_icon_checkmark');
        setDisplay(['none', 'inline', 'none', 'none'], message_user, follow_descr, profile_icon_follow, checkmark_icon_follow); 
    }

    function showEditProfile() {
        history.push(`${history.location.pathname}/editProfile`)
    }

    function followUnfollowButtonListener(e) {
        // message box being displayed been the logged in user already follows the current user
        // and clicking the follow box again indicates user wants to unfollow the given user
        // and vice-versa -- logic handled in backend 
        followUser(); 
    }


    async function followUser() {
        const spinner_div = document.getElementById('spinner_div_follow');
        const current_user = props.current_user; 
        const following_user = history.location.pathname.split('/')[1];
        const paragraph_description = document.getElementById('follow_descr');
        const profile_icon_follow = document.getElementById('follow_icon_profile');
        const checkmark_icon_follow = document.getElementById('follow_icon_checkmark');
        try {
            setDisplay(['none', 'block', 'none', 'none'], paragraph_description, spinner_div, profile_icon_follow, checkmark_icon_follow); 
            await checkTokenExpirationMiddleware(); 
            const follow_status_raw = await fetch(`/${current_user}/follow/${following_user}`, {
                method: 'PUT',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 
            const follow_status_json = await follow_status_raw.json(); 
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

        finally {
            setDisplay(['none'], spinner_div); 
        }
    }
    function addFollowingOrFollowersToDOM(array_followers_or_following, holder_div_id) {
        const holder_div = document.getElementById(holder_div_id);
        holder_div.textContent ='';
        for (let user of array_followers_or_following) {
            const user_DOMNode = createFollowOrFollowingUserDOMNodes(user);
            holder_div.appendChild(user_DOMNode); 
        }
    }

    function createFollowOrFollowingUserDOMNodes(user) {
        // FF - follow/ following 
        function createImgNameHolder() {
            const imgNameHolderDiv = document.createElement('div');
            imgNameHolderDiv.classList.add('img_name_holder_followerfollowing');

            const profile_pic = document.createElement('img');
            profile_pic.src = 'data:image/jpeg;base64,' + user.profile_picture;
            profile_pic.classList.add('img_followingfollower');
            imgNameHolderDiv.appendChild(profile_pic);

            const username = document.createElement('h3');
            username.innerHTML = `${user.username}`;

            const fullname = document.createElement('p');
            fullname.innerHTML = `${user.full_name}`;

            const name_username_holder = document.createElement('div');
            name_username_holder.classList.add('name_username_holder_followerfollowing');
            name_username_holder.appendChild(username);
            name_username_holder.appendChild(fullname);

            imgNameHolderDiv.appendChild(name_username_holder);
            return imgNameHolderDiv; 
        }

        function createFollowButton() {
            const button = document.createElement('button');
            button.classList.add('followerfollowing_userrelationship');
            button.innerHTML = 'Following';
            return button; 
        }

        const userFF_node = document.createElement('div');
        userFF_node.classList.add('followerfollowing_curr_user');

        const imgNameDiv = createImgNameHolder();
        const FF_button = createFollowButton();

        userFF_node.appendChild(imgNameDiv);
        userFF_node.appendChild(FF_button);

        return userFF_node; 
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
                        <button id = "message_user" className = "options_item following_user">
                            Message
                            <div className = "overlay_div_blackout profile_options_blackout"></div>
                        </button>
                        <button id = "follow_user" className = "options_item" onClick = {followUnfollowButtonListener}>
                            <div className = "overlay_div_blackout profile_options_blackout"></div>
                            <p id ='follow_descr'>Follow</p>
                            <div id = "spinner_div_follow" className="sk-chase sk-chase-follow">
                                    <div className="sk-chase-dot sk-chase-dot-follow"></div>
                                    <div className="sk-chase-dot sk-chase-dot-follow"></div>
                                    <div className="sk-chase-dot sk-chase-dot-follow"></div>
                                    <div className="sk-chase-dot sk-chase-dot-follow"></div>
                                    <div className="sk-chase-dot sk-chase-dot-follow"></div>
                                    <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            </div>
                            <i id = 'follow_icon_profile' className = "fas fa-user following_icon"></i>
                            <i id = 'follow_icon_checkmark' className = "fas fa-check following_icon"></i>
                        </button>
                        <div id = "options_profile_arrowdown" className = "arrow_tip_down options_item">
                            <div className = "overlay_div_blackout profile_options_blackout"></div>
                        </div>
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
                    <FollowBox 
                        current_user = {props.current_user}
                        addFollowingOrFollowersToDOM = {addFollowingOrFollowersToDOM}
                    /> 
                    <FollowingBox 
                        current_user = {props.current_user}
                        addFollowingOrFollowersToDOM = {addFollowingOrFollowersToDOM}
                    />
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