import React, { useEffect } from 'react';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, setDisplay, createPostOptionsDiv} from '../../../utility/utility_functions';


/**
 * This function represents a React component that renders the section of the homepage 
 * responsible for loading in the posts for a given user. 
 */
function HomePagePosts () {

    useEffect(() => {
        const commentIconsFlexboxContainer = document.getElementsByClassName('commentIconsFlexboxContainer')[0];
        commentIconsFlexboxContainer.textContent = ''; 
        const [likeCommentIcons, savedIcon] = createPostOptionsDiv();
        likeCommentIcons.classList.add('homepage_main_icon_holder')
        for(let i=0; i<likeCommentIcons.children.length; i++) {
            likeCommentIcons.children[i].classList.add('focus_icons');
        }
        savedIcon.children[0].classList.add('focus_icons');        
        commentIconsFlexboxContainer.appendChild(likeCommentIcons);
        commentIconsFlexboxContainer.appendChild(savedIcon); 
    });


    return(
        <div id = 'home_page_posts_plus_spinner'>
            <div id = 'home_page_posts_top_holder'>
                <div className = 'homepage_post'>
                    <div className = 'profile_pic_username_options_holder'>
                        <div className = 'profile_pic_username_holder'>
                            <img className = 'profilePicturePost homepageProfPic'  src = 'https://st3.depositphotos.com/4111759/13425/v/600/depositphotos_134255532-stock-illustration-profile-placeholder-male-default-profile.jpg'></img>
                            <h3 className = 'username_homepage_post'>Batmasdjasdjkasndjksanjdjaskdnjkasnkdjasnkjdaasjdaksdnkjasdkasnkdakdnjaksndaan</h3>
                        </div>
                        <i className = 'fas fa-ellipsis-h ellipis_post'></i>
                    </div>
                    <div className = 'homepage_post_imageHolder'>
                        <img className = 'homepage_post_img' src = 'https://i.pinimg.com/originals/22/2b/8e/222b8e6849b3a3a66c0bb7002b0e4603.jpg'></img>
                    </div>
                    <div className = 'homepage_post_options'>
                        <div className = 'commentIconsFlexboxContainer'>
                        </div>
                        <div className = 'likesHomepageHolder'>
                            <p>Liked by</p>
                            <p className = 'post_num_liked'>24 people</p>
                        </div>
                        <div className = 'username_caption_holder'>
                            <p className = 'username_homepage_post username_for_caption'>Batmandksajkdaasdksandksamkdaskdasksajkdakjdsjdaskndkasdaskjdnaskjdnkjasndkjas</p>
                            <p className = 'caption_homepage_post'></p>
                        </div>
                        <div className = 'comment_holder'>
                            <p>View all</p>
                            <p className = 'num_comments_homepagepost'>1000 comments</p>
                        </div>
                        <p className = 'date_posted'></p>
                    </div>
                    <div className = 'add_comment_holder'>
                            <textarea className = 'homepage_textarea' placeholder = 'Add a comment...'></textarea>
                            <p>Post</p>
                    </div>
                </div>
            </div>
            <div id = 'inf_scroll_homepage' className="sk-chase">
                <div className="sk-chase-dot sk-chase-infscroll"></div>
                <div className="sk-chase-dot sk-chase-infscroll"></div>
                <div className="sk-chase-dot sk-chase-infscroll"></div>
                <div className="sk-chase-dot sk-chase-infscroll"></div>
                <div className="sk-chase-dot sk-chase-infscroll"></div>
                <div className="sk-chase-dot sk-chase-infscroll"></div>
            </div>
        </div> 
    )
}

export {HomePagePosts}; 