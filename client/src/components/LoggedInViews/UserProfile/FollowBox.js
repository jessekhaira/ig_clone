import React from 'react';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, normalizeCounts, setDisplay, darkenBackground} from '../../../utility/utility_functions';


function FollowBox() {
    async function seeAllFollowers(e) {
        const follower_holder_flexbox = document.getElementById('follower_holder_flexbox');
        try {
            await checkTokenExpirationMiddleware(); 
            darkenBackground();
            follower_holder_flexbox.style.display = 'flex';
        }
        catch(err) {
            
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

export {FollowBox};