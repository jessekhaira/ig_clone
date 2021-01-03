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
            </div>
        </div>
    )
}

export {HomePagePosts}; 