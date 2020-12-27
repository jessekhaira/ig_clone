import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import {checkTokenExpirationMiddleware, setDisplay, _authenticationErrorLogOut} from '../../../utility/utility_functions';
import { useHistory } from 'react-router';

function UserProfilePosts (props) {
    const history = useHistory();
    const [numberOfTimesImagesRequested, setNumTimesImageReq] = useState(1);
    const [componentMountedFirstTime, setComponentMounted] = useState(false);
    useEffect(() => {
        console.log('mountin')
        async function fetchPosts() {
            // if we don't have this then the component can mount up to 2x and the grid will appear incorrectly
            // and we have to set component mounted ASAP when we get into the conditional -- doing after the
            // async call will still allow multiple calls to be dispatched 
            if (!componentMountedFirstTime) {
                setComponentMounted(true); 
                await props.fetchGridImages(); 
            }
        }
        fetchPosts(); 
    })

    

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