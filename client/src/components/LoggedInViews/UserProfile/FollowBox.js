import React from 'react';
import {checkTokenExpirationMiddleware, setDisplay,_authenticationErrorLogOut, lightenBackground,darkenBackground} from '../../../utility/utility_functions';


/**
 * This function represents a react functional component utilizing hooks. This component is a sub-component of 
 * the UserProfileInformation component, responsible for rendering the followers box for the users whose profile 
 * page is currently being viewed.
 */
function FollowBox(props) {

    /**
     * This function is the event handler for onClick events for the top level div rendered by this component
     * with id 'follower_info_div'. 
     * 
     * When the user clicks on any element contained within the div element, this event handler will send an
     * HTTP GET request to the server to obtain a list of all the users that are followers of the current user
     * (while displaying a spinner and hiding elements appropriately).
     */
    async function seeAllFollowers(e) {
        if (document.getElementById('follower_holder_flexbox').contains(e.target)) {
            return; 
        }
        const follower_holder_flexbox = document.getElementById('follower_holder_flexbox');
        const spinner_div = document.getElementById('spinner_followbox');
        const direct_follower_holder = document.getElementById('followers_direct_holder');
        try {
            await checkTokenExpirationMiddleware(); 
            darkenBackground();
            setDisplay(['flex', 'block', 'none'], follower_holder_flexbox, spinner_div, direct_follower_holder);
            const fetched_data_raw = await fetch(`${props.user_profile_viewing}/${props.current_user}/followersBox`, {
                method: 'get',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 

            const followers_for_currUser = (await fetched_data_raw.json()).followers;
            if (followers_for_currUser === undefined) {
                throw Error('UnauthorizedUser');
            }
            props.addFollowingOrFollowersToDOM(followers_for_currUser, 'followers_direct_holder'); 
            document.addEventListener('click', removeFocusFollowersBox); 
        }

        catch(err) {
            err = String(err);
            if(err.includes('UnauthorizedUser')) {
                _authenticationErrorLogOut();
            }
        }

        finally {
            setDisplay(['none', 'block'], spinner_div, direct_follower_holder); 
        }
    }

    function removeFocusFollowersBox(e) {
        if (e.target.id === 'follower_holder_flexbox') {
            document.removeEventListener('click', removeFocusFollowersBox);
            lightenBackground();
            document.getElementById('follower_holder_flexbox').style.display = 'none'; 
        }
    }


    

    return(
        <div role = 'button' aria-label = 'button that is used to see all followers' id = "follower_info_div" className = "meta_info_user_divcontainer" onClick = {seeAllFollowers}>
            <p id = "follower_count" className = "post_info_counts"></p>
            <p className = "post_info_descr">followers</p>
            <div id = 'follower_holder_flexbox' className = 'container_following_followers'>
                <div id = 'users_following_thisUser' className = 'following_followers'>
                    <div className = 'descr_cancel_container'>
                        <p>Followers</p>
                        <i className = "fas fa-times X" onClick = {props.cancelFocusFollowersFollowing} id = 'follower_cancel'></i> 
                    </div>
                    <div id = 'spinner_followbox' className="sk-chase sk-chase-FFBoxes">
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                    </div>
                    <div id = 'followers_direct_holder' className = "followersfollowing_direct_holder">
                    </div>
                </div>
            </div>
        </div>
    )
}

export {FollowBox};