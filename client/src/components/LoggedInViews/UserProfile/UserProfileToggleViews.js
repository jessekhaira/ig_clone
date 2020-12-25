import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

function UserProfileToggleViews () {
    const history = useHistory(); 

    useEffect(() => {
        // component mounts, highlight posts component
        highlightViewCurrentlyOn('grid_posts_description', 'posts_icon', 'posts_div'); 
    })

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

    return (
        <div id = "user_toggle_profile_views_container">
            <div id = "direct_parent_container">
                <div id = "add_post_div" className = "toggle_containers">
                    <i id = "add_post_icon" className = "toggle_icons fas fa-plus"></i>
                    <label htmlFor = "uploadPhoto" className = "posts_descr" id = "labelUploadPhotos">UPLOAD</label>
                    <input type="file" id="uploadPhoto" accept="image/*" />
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