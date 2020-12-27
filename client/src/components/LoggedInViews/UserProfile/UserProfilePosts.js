import React, { useEffect, useState } from 'react';
import {infiniteScroll, setDisplay} from '../../../utility/utility_functions';
import { useHistory } from 'react-router';

function UserProfilePosts (props) {
    const history = useHistory();
    const [imgNumRequest, setNumTimesImageReq] = useState(1);
    
    useEffect(() => {
        // effect runs for the first time the component mounts or when the pathname changes for 
        // user profiles -- have to reset anything held inside grid originally -- therefore
        // our imgNumRequest should be reset to 2 as well
        const grid_container = document.getElementById('grid_container_images');
        grid_container.innerHTML = ''; 
        setDisplay(['none'], grid_container); 
        const user_profile_viewing = history.location.pathname.split('/')[1];
        const spinner_div = document.getElementById('spinner_div_photos');
        fetchPosts(spinner_div, user_profile_viewing,1); 
        setNumTimesImageReq(2); 
    }, [history.location.pathname]);

    async function fetchPosts(spinner_div, user_profile_viewing, timesRequested) {
        const photos = await props.fetchGridImages(spinner_div, user_profile_viewing, timesRequested);
        return photos;
    }

    useEffect(() => {
        window.addEventListener('scroll', infScrollUserProfile);
        return () => window.removeEventListener('scroll', infScrollUserProfile); 
    });

    async function infScrollUserProfile() {
        const spinner_div = document.getElementById('infinite_scrolling_div_profiles'); 
        if (infiniteScroll() && document.getElementById('grid_container_images').children.length > 0) {
            const user_profile_viewing = history.location.pathname.split('/')[1];
            // disable event listener while we make the call 
            window.removeEventListener('scroll', infScrollUserProfile);
            const photos = await fetchPosts(spinner_div, user_profile_viewing, imgNumRequest);
            // no new photos returned means disable event listener for window
            if (photos.length === 0) {
                window.removeEventListener('scroll', infScrollUserProfile);
                return; 
            } 
            else {
                window.addEventListener('scroll', infScrollUserProfile);
                console.log(imgNumRequest);
                setNumTimesImageReq(imgNumRequest+1); 
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