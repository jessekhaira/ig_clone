import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';

function UserProfilePosts (props) {

    useEffect(() => {
        async function fetchPosts() {
            await props.aysncCallToMountInformation('/posts'); 
        }
        // fetchPosts(); 
    })
    return (
        <div id = "user_profile_posts_overallholder">
            <div id = "anim_holder" className="sk-chase">
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
                <div className="sk-chase-dot"></div>
            </div>
            <div id = "grid_photo_div">
                <div className = "grid_photo_information"></div>
                <img className = "grid_photo" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            </div>

            <div id = "grid_photo_div">
                <div className = "grid_photo_information"></div>
                <img className = "grid_photo" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            </div>

            <div id = "grid_photo_div">
                <div className = "grid_photo_information"></div>
                <img className = "grid_photo" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            </div>

            <div id = "grid_photo_div">
                <div className = "grid_photo_information"></div>
                <img className = "grid_photo" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            </div>
            
            <div id = "grid_photo_div">
                <div className = "grid_photo_information"></div>
                <img className = "grid_photo" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            </div>

            <div id = "grid_photo_div">
                <div className = "grid_photo_information"></div>
                <img className = "grid_photo" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            </div>

            <div id = "grid_photo_div">
                <div className = "grid_photo_information"></div>
                <img className = "grid_photo" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            </div>

            <div id = "grid_photo_div">
                <div className = "grid_photo_information"></div>
                <img className = "grid_photo" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            </div>

            <div id = "grid_photo_div">
                <div className = "grid_photo_information"></div>
                <img className = "grid_photo" src = "https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg"></img>
            </div>
            
        </div>
    )
}

export {UserProfilePosts}; 