import React, { useEffect, useState } from 'react';
import {infiniteScroll, setDisplay} from '../../../utility/utility_functions';
import { useHistory } from 'react-router';

function UserProfilePosts (props) {
    const history = useHistory();
    const [imgNumRequest, setNumTimesImageReq] = useState(2);
    
    useEffect(() => {
        async function fetchPosts() {
            const user_profile_viewing = history.location.pathname.split('/')[1];
            await props.fetchGridImages(user_profile_viewing, 1);
        }
        fetchPosts(); 
    }, [history.location.pathname]);

    useEffect(() => {
        window.addEventListener('scroll', infScrollUserProfile);
        return () => window.removeEventListener('scroll', infScrollUserProfile); 
    });

    async function infScrollUserProfile() {
        const spinner_div = document.getElementById('infinite_scrolling_div_profiles'); 
        console.log(document.getElementById('grid_container_images').children.length > 0);
        if (infiniteScroll() && document.getElementById('grid_container_images').children.length > 0) {
            try {
                setDisplay(['block'], spinner_div);
            }
            catch(err) {

            }
        }
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
        </div>
    )
}

export {UserProfilePosts}; 