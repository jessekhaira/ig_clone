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
                        <img className = 'homepage_profile_pic'></img>
                        <h3 className = 'username_homepage_post'>Batman</h3>
                    </div>
                    <i className = 'fas fa-ellipsis-h homepage_options'></i>
                </div>
                <div className = 'homepage_post_imageHolder'>
                    <img className = 'homepage_post_img'></img>
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