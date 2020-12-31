import React from 'react';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';
import { useHistory } from 'react-router';


function FocusedOnImage (props) {
    const history = useHistory();

    function togglePictureOptions(e) {
        e.stopPropagation();
        const pictureOptionsHolder = document.getElementById('focusedPictureOptions');
        pictureOptionsHolder.style.display = pictureOptionsHolder.style.display === 'block' ? 'none': 'block'; 
    }

    async function deleteImage(e) {
        try {
            const img_id = document.getElementById('photo_focused_on').getAttribute('id_backend');
            await checkTokenExpirationMiddleware();
            const user_profile_viewing = history.location.pathname.split('/')[1];

            const img_delete_status  = await fetch(`${user_profile_viewing}/${img_id}`, {
                headers: {
                    authorization: localStorage.getItem('accessToken')
                },
                method: 'delete'
            }); 
            if ('UnauthorizedUser' in img_delete_status) {
                throw Error('UnauthorizedUser'); 
            }
            window.location.reload(); 
        }
        catch(err) {
            err = String(err);
            if (err.includes('UnauthorizedUser')) {
                _authenticationErrorLogOut(); 
            }
        }
    }


    return (
        <div id = "focused_container">
            <div id = 'overall_flex_container_photofocused'>
                <div id = 'img_focused_divcontainer'>
                    <img id = 'photo_focused_on'></img>
                </div>
                <div id = 'info_img_divcontainer'>
                    <div id = 'profileNamePictureDiv'>
                        <div id = 'profileNamePictureFlexboxFocus'>
                            <img id = 'profilePictureFocus'></img>
                            <p id = 'usernameFocus'></p>
                        </div>
                        <div id = 'optionsProfileDiv'>
                            <i id = 'focusOptions' className ='fas fa-ellipsis-h' onClick = {togglePictureOptions}></i>
                            <div id = 'focusedPictureOptions'>
                                <div id = 'option_go_to_post' className = 'optionsFocusedOnPicture'>Go To Post</div>
                                <div id = 'delete_image' className = 'optionsFocusedOnPicture' onClick = {deleteImage}>Delete Picture</div>
                                <div id = 'cancel_options_image' className = 'optionsFocusedOnPicture' onClick = {props.cancelPictureOptions}>Cancel</div>

                            </div>
                        </div>
                    </div>
                    <div id = 'comments_section_div'>
                        <div className = 'commentsPicture'></div>
                    </div>

                    <div id = 'like_add_comment_div'>
                        <div id = 'commentIconsFlexboxContainer'>
                            <div id = 'likeCommentDMFlexboxContainer'>
                                <i id = 'heart_focus' className = 'far fa-heart focus_icons'></i>
                                <i id = 'comment_focus' className = 'far fa-comment focus_icons'></i>
                                <i id = 'dm_focus' className = 'far fa-paper-plane focus_icons'></i>
                            </div>
                            <div id = 'savedFlexboxContainer'>
                                <i id = 'saved_focus' className = 'focus_icons far fa-bookmark'></i>
                            </div>
                        </div>
                        <div id = 'usersWhoLikedBox'>
                            <p>Liked by</p>
                            <p id ='num_peoples_liked_focus'></p>
                        </div>
                        <div id = 'date_added'></div>
                        <div id = 'add_comment_holder'>
                            <textarea id = 'add_comment' type = 'text' placeholder = 'Add a Comment...'></textarea>
                            <p id = 'submit_comment'>Post</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {FocusedOnImage}; 