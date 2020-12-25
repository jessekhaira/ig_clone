import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';

function UserProfilePosts (props) {

    useEffect(() => {
        async function fetchPosts() {
            // await props.aysncCallToMountInformation('/posts'); 
            createPhotos({});
        }
        fetchPosts(); 
    })

    function createPhotos(photos) {
        const top_level_holder = document.getElementById('user_profile_posts_overallholder');
        for (let i=0; i<12; i++) {
            top_level_holder.appendChild(createSinglePhotoContainer('https://icon-library.com/images/generic-profile-icon/generic-profile-icon-23.jpg'));
        }
    }

    function createSinglePhotoContainer(photo) {
        function createGridPhotoInfoDiv() {
            const info_photo = document.createElement('div');
            info_photo.classList.add('grid_photo_information');
            return info_photo
        }
        function createGridPhotoDiv() {
            const img_grid = document.createElement('img');
            img_grid.classList.add('grid_photo');
            img_grid.src = photo;
            return img_grid;
        }

        const container_div = document.createElement('div');
        container_div.classList.add('grid_photo_div');
        container_div.appendChild(createGridPhotoInfoDiv());
        container_div.appendChild(createGridPhotoDiv());
        return container_div;
    }

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
        </div>
    )
}

export {UserProfilePosts}; 