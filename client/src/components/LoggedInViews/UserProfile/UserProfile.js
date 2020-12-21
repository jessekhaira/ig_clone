import React from 'react';
import {UserProfileInformation} from './UserProfileInformation';
import {UserProfileToggleViews} from './UserProfileToggleViews';
import {UserProfilePosts} from './UserProfilePosts';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';
import jwt_decode from 'jwt-decode';


function UserProfile () {
    return (
        <div id = "user_profile_top_level_div">
            <div id = "resize_together_container">
                <UserProfileInformation 
                    aysncCallToMountInformation = {aysncCallToMountInformation}
                /> 
                <UserProfileToggleViews /> 
                <UserProfilePosts 
                    aysncCallToMountInformation = {aysncCallToMountInformation}
                /> 
            </div>
        </div>
    )
}


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

export {UserProfile}; 