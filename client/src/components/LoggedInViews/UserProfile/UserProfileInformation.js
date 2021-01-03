import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {useHistory} from 'react-router-dom';
import {FollowBox} from './FollowBox';
import {FollowingBox} from './FollowingBox';
import {checkTokenExpirationMiddleware, createSpinnersProgrammatically,_authenticationErrorLogOut, normalizeCounts, setDisplay, darkenBackground, lightenBackground} from '../../../utility/utility_functions';

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
        const paragraph_description = document.getElementById('follow_descr');
        const profile_icon_follow = document.getElementById('follow_icon_profile');
        const checkmark_icon_follow = document.getElementById('follow_icon_checkmark');
        try {
            setDisplay(['none', 'block', 'none', 'none'], paragraph_description, spinner_div, profile_icon_follow, checkmark_icon_follow); 
            await checkTokenExpirationMiddleware(); 
            const follow_status_raw = await fetch(`/${props.current_user}/follow/${user_profile_viewing}`, {
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

    function redirectToUsersProfile(e) {
        e.preventDefault();
        history.push(`/${e.target.innerHTML}`);
        lightenBackground();
        const holder_div = e.target.closest('.container_following_followers');
        holder_div.style.display = 'none';
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
            username.addEventListener('click', redirectToUsersProfile);

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
            // edge case -- logged in user should not have button available to follow themselves 
            // prevent button from being shown in case logged in user has same name as the users
            // whose profile is being viewed
            const button = document.createElement('button');
            button.classList.add('followerfollowing_userrelationship');
            const spinner = createSpinnersProgrammatically('boxButtonSpinner', 'sk-chase-follow', 'sk-chase-dot-follow');
            const descr_paragraph = document.createElement('p');
            descr_paragraph.style.display = 'inline';
            button.appendChild(descr_paragraph);
            button.appendChild(spinner); 
            button.addEventListener('click', clickHandlerBoxButtons); 
            if (user.curr_user_following_this_user === true) {
                button.children[0].innerHTML = 'Following';
                button.classList.remove('followUserButtonBoxes');
            }
            else {
                button.children[0].innerHTML = 'Follow'; 
                button.classList.add('followUserButtonBoxes');
            }

            if (props.current_user === user.username) {
                button.style.visibility = 'hidden';
                button.style.pointerEvents = 'none'; 
            }
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

    async function clickHandlerBoxButtons(e) {
        const button = e.target.closest('.followerfollowing_userrelationship');
        const spinner_div = button.children[1];
        const descr_div = button.children[0]; 
        if (descr_div.innerHTML === 'Following') {
            followUnfollowBoxButtonRequest(button, spinner_div, descr_div, true);
        }
        else {
            followUnfollowBoxButtonRequest(button, spinner_div, descr_div, false);
        }
    }

    async function followUnfollowBoxButtonRequest(button, spinner_div, descr_div, curr_following) {
        try {
            setDisplay(['block', 'none'], spinner_div, descr_div);
            button.removeEventListener('click', clickHandlerBoxButtons);
            const unfollowStatusRaw = await fetch(`/${props.current_user}/follow/${user_profile_viewing}`, {
                method: 'PUT',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 
            const unfollowStatus = await unfollowStatusRaw.json();

            if ("UnauthorizedUser" in unfollowStatus) {
                throw Error('UnauthorizedUser');
            }
            if (curr_following) {
                descr_div.innerHTML = 'Follow';
                button.classList.add('followUserButtonBoxes');
            }
            else {
                descr_div.innerHTML = 'Following';
                button.classList.remove('followUserButtonBoxes');
            }
            button.addEventListener('click', clickHandlerBoxButtons); 
            setDisplay(['inline'], descr_div);
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

    function cancelFocusFollowersFollowing(e) {
        if (e.target.id === 'follower_cancel') {
            document.getElementById('follower_holder_flexbox').style.display = 'none';
        }
        else {
            document.getElementById('following_holder_flexbox').style.display = 'none'; 
        }
        lightenBackground();
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
                        user_profile_viewing = {user_profile_viewing}
                        current_user = {props.current_user}
                        addFollowingOrFollowersToDOM = {addFollowingOrFollowersToDOM}
                        cancelFocusFollowersFollowing = {cancelFocusFollowersFollowing}
                    /> 
                    <FollowingBox 
                        user_profile_viewing = {user_profile_viewing}
                        current_user = {props.current_user}
                        addFollowingOrFollowersToDOM = {addFollowingOrFollowersToDOM}
                        cancelFocusFollowersFollowing = {cancelFocusFollowersFollowing}
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