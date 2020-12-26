import React from 'react';
import {UserProfileInformation} from './UserProfileInformation';
import {UserProfileToggleViews} from './UserProfileToggleViews';
import {UserProfilePosts} from './UserProfilePosts';
import {EditProfile} from './EditUserProfile';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';
import {setDisplay} from '../../../utility/utility_functions';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';

function UserProfile (props) { 

    const history = useHistory();

    async function aysncCallToMountInformation(endpoint, username_belongingto_profile, method, body) {
        const spinner_div = document.getElementById('spinner_div_userprofiles');
        const user_not_found_container = document.getElementById('user_not_found_container');
        const resize_together_container = document.getElementById('resize_together_container');
        try {
            await checkTokenExpirationMiddleware(); 
            setDisplay(['block', 'none', 'none'], spinner_div, resize_together_container, user_not_found_container);
            const returned_profile_info_raw = await fetch(`/${username_belongingto_profile}/${endpoint}`, {
                method: method,
                body: body, 
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 
            const returned_profile_info_json= await returned_profile_info_raw.json(); 
            if ("UnauthorizedUser" in returned_profile_info_json) {
                throw Error('UnauthorizedUser');
            }
            else if ("userNotFound" in returned_profile_info_json) {
                setDisplay(['none', 'none', 'block'], spinner_div, resize_together_container, user_not_found_container);
            }

            else {
                setDisplay(['none', 'block', 'none'], spinner_div, resize_together_container, user_not_found_container);
                return returned_profile_info_json; 
            }
        }
        catch(err) {
            err = String(err);
            if(err.includes('UnauthorizedUser')) {
                _authenticationErrorLogOut();
            }
        }
    }

    async function fetchGridImages() {
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


    function createPhotos(photos) {
        // edge case user has no posts, dealing with that case with conditional statement below
        const grid_container = document.getElementById('grid_container_images');
        const no_posts_container = document.getElementById('no_posts_found');
        if (photos.length === 0) {
            setDisplay(['flex','none'], no_posts_container, grid_container); 
        }
        else {
            setDisplay(['none','grid'], no_posts_container, grid_container)
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
        <Switch>
            <Route exact path = '/:username/editProfile' render = {() =>
                <EditProfile 
                    current_user = {props.current_user} 
                    set_curr_user = {props.set_curr_user}
                /> 
            }/>

            <Route exact path = '/:username' render = {() => 
                 <main id = "user_profile_top_level_div">
                    <div id = "spinner_div_userprofiles" className="sk-chase sk-chase-userprofile">
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                    </div>
                    <div id = "user_not_found_container">
                        <h2>Sorry, this page isn't available.</h2>
                        <p>The link you followed may be broken, or the page may have been removed.</p>
                        <Link to ='/' id = "back_to_ig"><p>Go back to Instagram.</p></Link>
                    </div>
                    <div id = "resize_together_container">
                        <UserProfileInformation 
                            current_user = {props.current_user} 
                            aysncCallToMountInformation = {aysncCallToMountInformation}
                        /> 
                        <UserProfileToggleViews 
                            current_user = {props.current_user} 
                        /> 
                        <UserProfilePosts 
                            aysncCallToMountInformation = {aysncCallToMountInformation}
                            fetchGridImages = {fetchGridImages}
                        /> 
                    </div>
                </main>
            }/> 

            <Route path = '/' render = {() => 
                <Redirect to = {`/${props.current_user}`} /> 
            }/>
        </Switch>
    )
}


export {UserProfile}; 