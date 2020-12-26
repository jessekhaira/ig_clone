import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import {checkTokenExpirationMiddleware, setDisplay, _authenticationErrorLogOut} from '../../../utility/utility_functions';
import { useHistory } from 'react-router';

function UserProfilePosts (props) {
    const history = useHistory();
    const [numberOfTimesImagesRequested, setNumTimesImageReq] = useState(1);
    const [componentMountedFirstTime, setComponentMounted] = useState(false);
    useEffect(() => {
        async function fetchPosts() {
            // if we don't have this then the component can mount up to 2x and the grid will appear incorrectly
            // and we have to set component mounted ASAP when we get into the conditional -- doing after the
            // async call will still allow multiple calls to be dispatched 
            if (!componentMountedFirstTime) {
                setComponentMounted(true); 
                const spinner_div = document.getElementById('spinner_div_photos');
                const user_not_found_container = document.getElementById('user_not_found_container');
                const user_profile_viewing = history.location.pathname.split('/')[1];
                const grid_container = document.getElementById('grid_container_images');
                grid_container.innerHTML ='';
                try {
                    setDisplay(['block', 'none'], spinner_div, grid_container);
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
                    if (spinner_div !== null) {
                        setDisplay(['none'], spinner_div); 
                    }
                }
            }
        }
        fetchPosts(); 
    })

    function createPhotos(photos) {
        // edge case user has no posts, dealing with that case with conditional statement below
        const grid_container = document.getElementById('grid_container_images');
        const no_posts_container = document.getElementById('no_posts_found');
        if (photos.length === 0) {
            setDisplay(['flex','none'], no_posts_container, grid_container); 
        }
        else {
            setDisplay(['none','grid'], grid_container)
            for (let photo of photos) {
                grid_container.appendChild(createSinglePhotoContainer(photo));
            }
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
            <div id = "grid_container_images">
            </div>
            <div id = "no_posts_found">
                <i id = "camera_icon" className = "fa fa-camera"></i>
                <h1>No Posts Yet</h1>
            </div>
        </div>
    )
}

export {UserProfilePosts}; 