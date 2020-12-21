import React, { useState } from 'react';
import {UserProfileInformation} from './UserProfileInformation';
import {UserProfileToggleViews} from './UserProfileToggleViews';
import {UserProfilePosts} from './UserProfilePosts';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';
import jwt_decode from 'jwt-decode';


function UserProfile () {
    // local state values needed in order to conditionally render either a spinner 
    // or a message indicating the user doesn't exist in our database 
    const [currentlyFetching, setCurrentlyFetching] = useState(false); 
    const [userNotFound, setUserNotFound] = useState(false); 

    async function aysncCallToMountInformation(endpoint) {
        try {
            await checkTokenExpirationMiddleware(); 
            const username = jwt_decode(localStorage.getItem('accessToken')).username; 
            const returned_profile_info_raw = await fetch(`/${username}/${endpoint}`, {
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 
    
            const returned_profile_info_json= await returned_profile_info_raw.json(); 
            return returned_profile_info_json; 
        }
        catch(err) {
            console.log(err); 
            _authenticationErrorLogOut();
        }
    }
    return (
        <div id = "user_profile_top_level_div">
            {currentlyFetching ? 
                <div id = "spinner_div_notifications" className="sk-chase sk-chase-userprofile">
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                    <div className="sk-chase-dot sk-chase-dot-notif"></div>
                </div>
            : userNotFound ? 
                <div id = "user_not_found_container">
                </div>
            :
            <div id = "resize_together_container">
                <UserProfileInformation 
                    aysncCallToMountInformation = {aysncCallToMountInformation}
                /> 
                <UserProfileToggleViews /> 
                <UserProfilePosts 
                    aysncCallToMountInformation = {aysncCallToMountInformation}
                /> 
            </div>
            }
        </div>
    )
}


export {UserProfile}; 