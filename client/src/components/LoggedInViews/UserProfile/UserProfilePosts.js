import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import {checkTokenExpirationMiddleware, setDisplay, _authenticationErrorLogOut} from '../../../utility/utility_functions';
import { useHistory } from 'react-router';

function UserProfilePosts (props) {
    const history = useHistory();
    const [numberOfTimesImagesRequested, setNumTimesImageReq] = useState(1);

    useEffect(() => {
        async function fetchPosts() {
            const spinner_div = document.getElementById('spinner_div_photos');
            const user_not_found_container = document.getElementById('user_not_found_container');
            const user_profile_viewing = history.location.pathname.split('/')[1];
            const grid_container = document.getElementById('user_profile_posts_overallholder');
            try {
                setDisplay(['block'], spinner_div);
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
                else if ('userNotFound' in photos_json) {
                    throw Error; 
                }
                else {
                    createPhotos(photos_json.photos);
                }
            }
            catch(err) {
                err = String(err);
                if (err.includes('UnauthorizedUser')) {
                    _authenticationErrorLogOut(); 
                }
            }

            finally {
                setDisplay(['none'], spinner_div); 
                // grid_container.style.alignItems = 'none';
                // grid_container.style.justifyContent = 'none';
            }
        }
        fetchPosts(); 
    })

    function createPhotos(photos) {
        const top_level_holder = document.getElementById('user_profile_posts_overallholder');
        for (let photo of photos) {
            top_level_holder.appendChild(createSinglePhotoContainer(photo));
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
            img_grid.src = 'data:image/jpeg;base64,' + photo.data_photo;
            console.log(img_grid);
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