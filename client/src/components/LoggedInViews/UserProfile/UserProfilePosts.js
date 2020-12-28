import React, { useEffect, useState } from 'react';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut,infiniteScroll, setDisplay, darkenBackground, lightenBackground} from '../../../utility/utility_functions';
import { useHistory } from 'react-router';

function UserProfilePosts (props) {
    const history = useHistory();
    const [imgNumRequest, setNumTimesImageReq] = useState(1);
    
    useEffect(() => {
        // effect runs for the first time the component mounts or when the pathname changes for 
        // user profiles -- have to reset anything held inside grid originally -- therefore
        // our imgNumRequest should be reset to 2 as well
        const grid_container = document.getElementById('grid_container_images');
        grid_container.innerHTML = ''; 
        setDisplay(['none'], grid_container); 
        const user_profile_viewing = history.location.pathname.split('/')[1];
        const spinner_div = document.getElementById('spinner_div_photos');
        fetchPosts(spinner_div, user_profile_viewing,1); 
        setNumTimesImageReq(2); 
        return () => window.removeEventListener('scroll', infScrollUserProfile); 
    }, [history.location.pathname]);

    async function fetchPosts(spinner_div, user_profile_viewing, timesRequested) {
        const photos = await fetchGridImages(spinner_div, user_profile_viewing, timesRequested);
        return photos;
    }

    useEffect(() => {
        window.addEventListener('scroll', infScrollUserProfile);
        return () => window.removeEventListener('scroll', infScrollUserProfile); 
    });

    async function infScrollUserProfile() {
        const spinner_div = document.getElementById('infinite_scrolling_div_profiles'); 
        // only if you have greater than or equal to 12 grid children do we need to bother with the async call
        if (infiniteScroll() && document.getElementById('grid_container_images').children.length >= 12) {
            const user_profile_viewing = history.location.pathname.split('/')[1];
            // disable event listener while we make the call 
            window.removeEventListener('scroll', infScrollUserProfile);
            const photos = await fetchPosts(spinner_div, user_profile_viewing, imgNumRequest);
            // no new photos returned means disable event listener for window
            if (photos.length === 0) {
                window.removeEventListener('scroll', infScrollUserProfile);
            } 
            else {
                window.addEventListener('scroll', infScrollUserProfile);
                console.log(imgNumRequest);
                setNumTimesImageReq(imgNumRequest+1); 
            }
        }
    }
    async function fetchGridImages(spinner_div, user_profile_viewing, slice_posts_requesting =1) {
        const no_posts_found = document.getElementById('no_posts_found');
        try {
            setDisplay(['block', 'none'], spinner_div, no_posts_found);
            await checkTokenExpirationMiddleware();
            const photos_raw = await fetch(`${user_profile_viewing}/posts/${slice_posts_requesting}`, 
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
                throw Error('userNotFound');
            }
            else {
                createPhotos(photos_json.photos);
                return photos_json.photos;
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
        // only show no posts found if both the photos requested contains no photos
        // and the grid doesn't currently have any children within it because this is used
        // for inf scrolling as well 
        if (photos.length === 0 && grid_container.children.length === 0) {
            setDisplay(['flex','none'], no_posts_container, grid_container); 
        }
        else {
            setDisplay(['none','grid'], no_posts_container, grid_container);
            for (let photo of photos) {
                grid_container.appendChild(createSinglePhotoContainer(photo)); 
            }
        }
    }

    function createSinglePhotoContainer(photo) {
        function createGridPhotoInfoDiv() {
            const info_photo = document.createElement('div');
            info_photo.classList.add('grid_photo_information');

            // create comments holder and likes holder and add 
            const comments_holder = document.createElement('div');
            comments_holder.id = 'comments_holder'; 
            comments_holder.classList.add('infoPhotoHover')
            const likes_holder = document.createElement('div');
            likes_holder.id = 'likes_holder';
            likes_holder.classList.add('infoPhotoHover')


            // comments information 
            const num_comments = document.createElement('p');
            num_comments.innerHTML = photo.num_comments; 
            num_comments.id = 'num_comments_post';
            const comments_icon = document.createElement('i');
            comments_icon.classList.add('fas');
            comments_icon.classList.add('fa-comment');
            comments_icon.classList.add('comment');
            
            // add comments information to comments holder
            comments_holder.appendChild(comments_icon);
            comments_holder.appendChild(num_comments);

            // likes information 
            const num_likes = document.createElement('p');
            num_likes.innerHTML = photo.num_likes; 
            num_likes.id = 'num_likes_post';
            const likes_icon = document.createElement('i');
            likes_icon.classList.add('fas');
            likes_icon.classList.add('fa-heart');
            likes_icon.classList.add('likes_icon_post');
            
            // add likes information to likes holder
            likes_holder.appendChild(likes_icon);
            likes_holder.appendChild(num_likes);


            info_photo.appendChild(likes_holder);
            info_photo.appendChild(comments_holder); 
            return info_photo
        }
        function createGridPhotoDiv() {
            const img_grid = document.createElement('img');
            img_grid.classList.add('grid_photo');
            img_grid.src = 'data:image/jpeg;base64,' + photo.data_photo;
            img_grid.id = photo.id;
            return img_grid;
        }

        const container_div = document.createElement('div');
        container_div.classList.add('grid_photo_div');
        container_div.appendChild(createGridPhotoInfoDiv());
        container_div.appendChild(createGridPhotoDiv());

        container_div.addEventListener('click', showFullSizePhotoClick); 
        container_div.addEventListener('mouseenter', showPhotoInformation);
        container_div.addEventListener('mouseleave', hidePhotoInformation);
        return container_div;
    }

    function showPhotoInformation(e) {
        const grid_photo_div_ancestor = e.target.closest('.grid_photo_div');
        const grid_info = grid_photo_div_ancestor.children[0]; 
        grid_info.style.display = 'flex'; 
    }
    
    function hidePhotoInformation(e) {
        const grid_photo_div_ancestor = e.target.closest('.grid_photo_div');
        const grid_info = grid_photo_div_ancestor.children[0]; 
        grid_info.style.display = 'none'; 
    }

    function showFullSizePhotoClick(e) {
        // you can click on the grid photo information so re-routing every single click to the parent
        // ancestor called grid_photo_div and then from there, going down and finding the img
        const grid_photo_div_ancestor = e.target.closest('.grid_photo_div');
        const grid_img = grid_photo_div_ancestor.querySelectorAll('img')[0];
        darkenBackground(showPhotoInformation, hidePhotoInformation); 

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
            <div id = "infinite_scrolling_div_profiles" className="sk-chase">
                <div className="sk-chase-dot sk-chase-infscroll"></div>
                <div className="sk-chase-dot sk-chase-infscroll"></div>
                <div className="sk-chase-dot sk-chase-infscroll"></div>
                <div className="sk-chase-dot sk-chase-infscroll"></div>
                <div className="sk-chase-dot sk-chase-infscroll"></div>
                <div className="sk-chase-dot sk-chase-infscroll"></div>
            </div>
            <div id = "focused_container">
                <div id = 'overall_flex_container_photofocused'>
                    <div id = 'img_focused_divcontainer'>
                        <img id = 'photo_focused_on'></img>
                    </div>
                    <div id = 'info_img_divcontainer'>
                        <div id = 'profileNamePictureDiv'>

                        </div>
                        <div id = 'comments_section_div'>

                        </div>

                        <div id = 'like_add_comment_div'>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {UserProfilePosts}; 