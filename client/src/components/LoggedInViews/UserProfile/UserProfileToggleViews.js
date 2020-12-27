import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, setDisplay} from '../../../utility/utility_functions';

function UserProfileToggleViews (props) {
    const history = useHistory(); 

    useEffect(() => {
        // component mounts, highlight posts component
        highlightViewCurrentlyOn('grid_posts_description', 'posts_icon', 'posts_div'); 
    })
    

    /**
     * Function acts to highlight or unhighlight the currently active button depending on what the
     * user passes for the value on (default is true) and its corresponding icon for the buttons
     * container. 
     */
    function highlightViewCurrentlyOn(header_description_id, icon_id, container_id, on = true) {
        const posts_descr = document.getElementById(header_description_id);
        posts_descr.style.fontWeight = (on ? 'bold': '400');
        const posts_icon = document.getElementById(icon_id);
        const posts_div = document.getElementById(container_id);
        posts_div.style.borderTop = (on ? '2px solid': 'none');
        posts_div.style.color = (on ? 'black': '#8e8e8e');
        posts_icon.style.webkitTextStrokeWidth = (on ? '1.5px': '1.1px'); 

        if (on) {
            posts_icon.classList.add('active_toggle_icon');
        }
        else {
            posts_icon.classList.remove('active_toggle_icon');
        }
    }

    /**
     * This function acts as the event listener for the upload button shown on the toggle views, which is
     * only shown on the users own page. This function sends the data stored in the input type file to the
     * backend to be processed and added to the images this user has on the website. 
     */
    async function uploadPost(e) {
        const spinner_div = document.getElementById('spinner_div_upload');
        const add_icon = document.getElementById('add_post_icon'); 
        const error_upload = document.getElementById('error_adding_post');
        try {
            setDisplay(['block', 'none', 'none'], spinner_div, add_icon, error_upload);
            await checkTokenExpirationMiddleware(); 
            const img = e.target.files[0]; 
            let formInfo = new FormData();
            formInfo.append('image', img); 
            let photoUploadStatusRaw = await fetch(`/${props.current_user}/posts`, {
                method: 'POST',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                },
                body: formInfo
            });
            let photoUploadStatus = await photoUploadStatusRaw.json();
            // two separate errors we have to deal with -- user being unauthorized
            // resulting in a logout, and the server having an issue processing the image 
            // in the first place 
            if ('UnauthorizedUser' in photoUploadStatus) {
                throw Error('UnauthorizedUser'); 
            } 
            else if ('ErrorProcessing' in photoUploadStatus) {
                throw Error('ErrorProcessing');
            }
            setDisplay(['none', 'block'], spinner_div, add_icon);
            await props.fetchGridImages();
        }

        catch(err) {
            err = String(err);
            if (String(err).includes('UnauthorizedUser')) {
                _authenticationErrorLogOut(); 
            }
            else if (err.includes('ErrorProcessing')) {  
                // show red x to indicate an error occurred while uploading 
                setDisplay(['none','block'], spinner_div, error_upload);
            }
        }
    }

    function redirectClickInputUpload() {
        document.getElementById('uploadPhoto').click(); 
    }

    return (
        <div id = "user_toggle_profile_views_container">
            <div id = "direct_parent_container">
                <div id = "add_post_div" className = "toggle_containers">
                    <div id = "spinner_div_upload" className="sk-chase sk-chase-upload">
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                    </div>
                    <i id = "error_adding_post" className = "fas fa-times"></i>
                    <i id = "add_post_icon" className = "toggle_icons fas fa-plus" onClick = {redirectClickInputUpload}></i>
                    <label htmlFor = "uploadPhoto" className = "posts_descr" id = "labelUploadPhotos">UPLOAD</label>
                    <input type="file" id="uploadPhoto" accept="image/*" onChange = {uploadPost}/>
                </div>

                <div id = "posts_div" className = "toggle_containers">
                    <i id = "posts_icon" className = "toggle_icons fas fa-table"></i>
                    <h4 id = "grid_posts_description" className = "posts_descr">POSTS</h4>         
                </div>

                <div id = "IGTV_div" className = "toggle_containers">
                    <i id = "IGTV_Icon" className = "toggle_icons fas fa-tv"></i>
                    <h4 className = "posts_descr">IGTV</h4>         
                </div>

                
                <div id = "saved_div" className = "toggle_containers">
                    <i id = "saved_icon" className = "toggle_icons far fa-bookmark"></i>
                    <h4 className = "posts_descr">SAVED</h4>         
                </div>

                <div id = "tagged_div" className = "toggle_containers">
                    <i className="toggle_icons far fa-image"></i>
                    <h4 className = "posts_descr">TAGGED</h4>  
                </div>
            </div>
        </div>
    )
}

export {UserProfileToggleViews}; 