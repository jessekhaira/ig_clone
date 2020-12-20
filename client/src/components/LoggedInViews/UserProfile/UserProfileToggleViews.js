import React from 'react';

function UserProfileToggleViews () {
    return (
        <div id = "user_toggle_profile_views_container">
            <div id = "direct_parent_container">
                <div id = "add_post_div" className = "toggle_containers">
                    <i id = "add_post_icon" className = "toggle_icons fas fa-plus"></i>
                    <h4 className = "posts_descr">ADD POST</h4>
                </div>

                <div id = "posts_div" className = "toggle_containers">
                    <i id = "posts_icon" className = "toggle_icons fas fa-table"></i>
                    <h4 className = "posts_descr">POSTS</h4>         
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