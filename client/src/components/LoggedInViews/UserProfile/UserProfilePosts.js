import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';

function UserProfilePosts () {

    useEffect(async () => {
        try {
            await checkTokenExpirationMiddleware(); 
            const username = jwt_decode(localStorage.getItem('accessToken')).username; 
            const returned_profile_info_raw = await fetch(`/${username}`, {
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 
            const returned_profile_info_json= await returned_profile_info_raw.json(); 

        }
        catch(err) {
            console.log(err); 
            // _authenticationErrorLogOut();
        }
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