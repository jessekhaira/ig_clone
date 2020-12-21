import React from 'react';
import {UserProfileInformation} from './UserProfileInformation';
import {UserProfileToggleViews} from './UserProfileToggleViews';
import {UserProfilePosts} from './UserProfilePosts';


function UserProfile () {
    return (
        <div id = "user_profile_top_level_div">
            <div id = "resize_together_container">
                <UserProfileInformation /> 
                <UserProfileToggleViews /> 
                <UserProfilePosts /> 
            </div>
        </div>
    )
}

export {UserProfile}; 