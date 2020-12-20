import React from 'react';
import {UserProfileInformation} from './UserProfileInformation';
import {UserProfileToggleViews} from './UserProfileToggleViews';

function UserProfile () {
    return (
        <div id = "user_profile_top_level_div">
            <div id = "resize_together_container">
                <UserProfileInformation /> 
                <UserProfileToggleViews /> 
            </div>
            <div id = "photos_container">
            </div>
        </div>
    )
}

export {UserProfile}; 