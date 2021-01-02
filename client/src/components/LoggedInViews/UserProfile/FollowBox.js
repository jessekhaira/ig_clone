import React from 'react';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, darkenBackground} from '../../../utility/utility_functions';


function FollowBox(props) {
    async function seeAllFollowers(e) {
        if (document.getElementById('follower_holder_flexbox').contains(e.target)) {
            return; 
        }
        const follower_holder_flexbox = document.getElementById('follower_holder_flexbox');
        try {
            await checkTokenExpirationMiddleware(); 
            darkenBackground();
            follower_holder_flexbox.style.display = 'flex';
            const fetched_data_raw = await fetch(`${props.user_profile_viewing}/followers`, {
                method: 'get',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 

            const followers_for_currUser = (await fetched_data_raw.json()).followers;
            console.log(followers_for_currUser);
            if (followers_for_currUser === undefined) {
                throw Error('UnauthorizedUser');
            }
            props.addFollowingOrFollowersToDOM(followers_for_currUser, 'followers_direct_holder'); 
            // document.addEventListener('click', removeFocusFollowingBox); 
        }
        catch(err) {
            err = String(err);
            if(err.includes('UnauthorizedUser')) {
                _authenticationErrorLogOut();
            }
        }
    }
    

    return(
        <div id = "follower_info_div" className = "meta_info_user_divcontainer" onClick = {seeAllFollowers}>
            <p id = "follower_count" className = "post_info_counts"></p>
            <p className = "post_info_descr">followers</p>
            <div id = 'follower_holder_flexbox' className = 'container_following_followers'>
                <div id = 'users_following_thisUser' className = 'following_followers'>
                    <div className = 'descr_cancel_container'>
                        <p>Followers</p>
                        <i className = "fas fa-times X"></i> 
                    </div>
                    <div id = 'followers_direct_holder' className = "followersfollowing_direct_holder">
                    </div>
                </div>
            </div>
        </div>
    )
}

export {FollowBox};