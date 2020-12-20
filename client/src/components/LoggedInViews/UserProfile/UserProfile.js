import React from 'react';
import {UserProfileInformation} from './UserProfileInformation';

function UserProfile () {
    return (
        <div id = "user_profile_top_level_div">
            <UserProfileInformation /> 
            <div id = "user_toggle_profile_views_container">

            </div>
            <div id = "photos_container">

            </div>
        </div>
    )
}

export {UserProfile}; 