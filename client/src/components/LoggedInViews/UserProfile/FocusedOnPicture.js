import React, { useEffect } from 'react';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, setDisplay, createPostOptionsDiv} from '../../../utility/utility_functions';
import { useHistory } from 'react-router';


function FocusedOnImage (props) {

    useEffect(() => {
        if (props.current_user !== props.user_profile_viewing) {
            setDisplay(['none', 'flex'], document.getElementById('delete_image'), document.getElementById('report_image'));
        }
        else {
            setDisplay(['flex', 'none'], document.getElementById('delete_image'), document.getElementById('report_image')); 

        }
    });

    useEffect(() => {
        const commentIconsFlexboxContainer = document.getElementsByClassName('commentIconsFlexboxContainer')[0];
        commentIconsFlexboxContainer.textContent = ''; 
        const [likeCommentIcons, savedIcon] = createPostOptionsDiv();
        for(let i=0; i<likeCommentIcons.children.length; i++) {
            likeCommentIcons.children[i].classList.add('focus_icons');
            likeCommentIcons.children[i].classList.add('homepage_icons');

        }
        savedIcon.children[0].classList.add('focus_icons');
        commentIconsFlexboxContainer.appendChild(likeCommentIcons);
        commentIconsFlexboxContainer.appendChild(savedIcon); 
    });


    function togglePictureOptions(e) {
        e.stopPropagation();
        const pictureOptionsHolder = document.getElementById('focusedPictureOptions');
        pictureOptionsHolder.style.display = pictureOptionsHolder.style.display === 'block' ? 'none': 'block'; 
    }

    async function deleteImage(e) {
        try {
            const img_id = document.getElementById('photo_focused_on').getAttribute('id_backend');
            await checkTokenExpirationMiddleware();

            const img_delete_status  = await fetch(`${props.user_profile_viewing}/${img_id}`, {
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
                            <img id = 'profileFocus' className = 'profilePicturePost'></img>
                            <p id = 'usernameFocus'></p>
                        </div>
                        <div id = 'optionsProfileDiv'>
                            <i id = 'focusOptions' className ='fas fa-ellipsis-h' onClick = {togglePictureOptions}></i>
                            <div id = 'focusedPictureOptions'>
                                <div id = 'option_go_to_post' className = 'optionsFocusedOnPicture'>Go To Post</div>
                                <div id = 'report_image' className = 'optionsFocusedOnPicture'>Report Post</div>
                                <div id = 'delete_image' className = 'optionsFocusedOnPicture' onClick = {deleteImage}>Delete Picture</div>
                                <div id = 'cancel_options_image' className = 'optionsFocusedOnPicture' onClick = {props.cancelPictureOptions}>Cancel</div>
                            </div>
                        </div>
                    </div>
                    <div id = 'comments_section_div'>
                        <div className = 'commentsPicture'></div>
                    </div>

                    <div id = 'like_add_comment_div'>
                        <div className = 'commentIconsFlexboxContainer'>
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