import React, { useEffect } from 'react';
import {checkTokenExpirationMiddleware, lightenBackground,_authenticationErrorLogOut, normalizeCounts, setDisplay, darkenBackground} from '../../../utility/utility_functions';


/**
 * This function represents a react functional component utilizing hooks. This component is a sub-component of 
 * the UserProfileInformation component, responsible for rendering the following box for the users whose profile 
 * page is currently being viewed.
 */
function FollowingBox(props) {

    async function seeAllFollowing(e) {
        if (document.getElementById('following_holder_flexbox').contains(e.target)) {
            return; 
        }
        const following_holder_flexbox = document.getElementById('following_holder_flexbox');
        const spinner_div = document.getElementById('spinner_followingbox');
        const direct_following_holder = document.getElementById('following_direct_holder');
        try {
            await checkTokenExpirationMiddleware(); 
            darkenBackground();
            following_holder_flexbox.style.display = 'flex';
            setDisplay(['flex', 'block', 'none'], following_holder_flexbox, spinner_div, direct_following_holder);
            const fetched_data_raw = await fetch(`${props.user_profile_viewing}/${props.current_user}/followingBox`, {
                method: 'get',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 

            const users_following_currUser = (await fetched_data_raw.json()).following;
            if (users_following_currUser === undefined) {
                throw Error('UnauthorizedUser');
            }
            props.addFollowingOrFollowersToDOM(users_following_currUser, 'following_direct_holder'); 
            document.addEventListener('click', removeFocusFollowingBox); 
        }
        catch(err) {
            err = String(err);
            if(err.includes('UnauthorizedUser')) {
                _authenticationErrorLogOut();
            }
        }

        finally {
            setDisplay(['none', 'block'], spinner_div, direct_following_holder); 
        }
    }

    function removeFocusFollowingBox(e) {
        if (e.target.id === 'following_holder_flexbox') {
            document.removeEventListener('click', removeFocusFollowingBox);
            lightenBackground();
            document.getElementById('following_holder_flexbox').style.display = 'none'; 
        }
    }

    return(
        <div id = "following_info_div" className = "meta_info_user_divcontainer" onClick ={seeAllFollowing}>
            <p id = "following_count" className = "post_info_counts"></p>
            <p className = "post_info_descr">following</p>
            <div id = 'following_holder_flexbox' className = 'container_following_followers'>
                <div id = 'users_following_thisUser' className = 'following_followers'>
                    <div className = 'descr_cancel_container'>
                        <p>Following</p>
                        <i id = 'cancel_X' onClick = {props.cancelFocusFollowersFollowing} className = "fas fa-times X"></i> 
                    </div>
                    <div id = 'spinner_followingbox' className="sk-chase sk-chase-FFBoxes">
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                            <div className="sk-chase-dot sk-chase-dot-follow"></div>
                    </div>
                    <div id = 'following_direct_holder' className = "followersfollowing_direct_holder">
                    </div>
                </div>
            </div>
        </div>
    )
}

export {FollowingBox};