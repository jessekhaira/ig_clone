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
            const fetched_data_raw = await fetch(`${props.current_user}/following`, {
                method: 'get',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 

            const users_following_currUser = (await fetched_data_raw.json()).following;
            if (users_following_currUser === undefined) {
                throw Error('UnauthorizedUser');
            }
            addFollowingOrFollowersToDOM(users_following_currUser); 
            document.addEventListener('click', removeFocusFollowingBox); 
        }
        catch(err) {
            err = String(err);
            if(err.includes('UnauthorizedUser')) {
                _authenticationErrorLogOut();
            }
        }
    }

    function addFollowingOrFollowersToDOM(array_followers_or_following) {
        console.log(array_followers_or_following);
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
                        <i className = "fas fa-times X"></i> 
                    </div>
                    <div className = "followersfollowing_direct_holder">
                        <div className = "followerfollowing_curr_user">
                            <div className = "img_name_holder_followerfollowing">
                                <img className = "img_followingfollower" src = 'https://feedback.seekingalpha.com/s/cache/a1/e2/a1e22c9b37ea25351c6b703c1e441c1b.png'></img>
                                <div className = 'name_username_holder_followerfollowing'>
                                    <h3>Batman</h3>
                                    <p>Batman</p>
                                </div>
                            </div>
                            <button className = 'followerfollowing_userrelationship'>Following</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {FollowingBox};