import React, { useEffect } from 'react';
import {checkTokenExpirationMiddleware, lightenBackground,_authenticationErrorLogOut, normalizeCounts, setDisplay, darkenBackground} from '../../../utility/utility_functions';


function FollowingBox(props) {

    async function seeAllFollowing(e) {
        if (document.getElementById('following_holder_flexbox').contains(e.target)) {
            return; 
        }
        const following_holder_flexbox = document.getElementById('following_holder_flexbox');
        try {
            await checkTokenExpirationMiddleware(); 
            darkenBackground();
            following_holder_flexbox.style.display = 'flex';
            const fetched_data_raw = await fetch(`${props.user_profile_viewing}/following`, {
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
                    <div id = 'following_direct_holder' className = "followersfollowing_direct_holder">
                    </div>
                </div>
            </div>
        </div>
    )
}

export {FollowingBox};