import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';
import { useHistory } from 'react-router';

function UserProfilePosts (props) {
    const history = useHistory();
    const [numberOfTimesImagesRequested, setNumTimesImageReq] = useState(1);

    useEffect(() => {
        async function fetchPosts() {
            const spinner_div = document.getElementById('spinner_div_photos');
            const user_not_found_container = document.getElementById('user_not_found_container');
            const user_profile_viewing = history.location.pathname.split('/')[1];
            try {
                await checkTokenExpirationMiddleware();
                const photos_raw = await fetch(`${user_profile_viewing}/posts`, 
                {
                    method: 'get',
                    headers: {
                        authorization: localStorage.getItem('accessToken')
                    }
                });
                const photos_json = await photos_raw.json(); 
                if ('UnauthorizedUser' in photos_json) {
                    throw Error('UnauthorizedUser'); 
                }
                console.log(photos_json);
            }
            catch(err) {
                err = String(err);
                if (err.includes('UnauthorizedUser')) {
                    _authenticationErrorLogOut(); 
                }
            }
        }
        fetchPosts(); 
    })

    function createPhotos(photos) {
        const top_level_holder = document.getElementById('user_profile_posts_overallholder');
        for (let photo in photos) {
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
            <div id = "spinner_div_photos" className="sk-chase">
                <div className="sk-chase-dot sk-chase-posts"></div>
                <div className="sk-chase-dot sk-chase-posts"></div>
                <div className="sk-chase-dot sk-chase-posts"></div>
                <div className="sk-chase-dot sk-chase-posts"></div>
                <div className="sk-chase-dot sk-chase-posts"></div>
                <div className="sk-chase-dot sk-chase-posts"></div>
            </div>
        </div>
    )
}

export {UserProfilePosts}; 