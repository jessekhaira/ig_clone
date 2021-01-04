import React, { useEffect } from 'react';


/**
 * This function represents a React component that renders the section of the homepage 
 * responsible for loading in the posts for a given user. 
 */
function HomePagePosts () {
    return(
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
                <div className = 'commentIconsFlexboxContainer'>
                </div>
                <div className = 'likesHomepageHolder'>
                    <p>Liked by</p>
                    <p></p>
                </div>
                <div className = 'username_caption_holder'>
                    <p className = 'username_homepage_post'></p>
                    <p className = 'caption_homepage_post'></p>
                </div>
                <div className = 'comment_holder'>
                    <p>View comments</p>
                </div>
                <p className = 'date_posted'></p>
                <div className = 'add_comment_holder'>
                    <textarea className = 'homepage_textarea'></textarea>
                    <p>Post</p>
                </div>
            </div>
        </div>
    )
}

export {HomePagePosts}; 