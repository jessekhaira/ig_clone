import React from 'react';
import {UserProfileInformation} from './UserProfileInformation';
import {UserProfileToggleViews} from './UserProfileToggleViews';
import {UserProfilePosts} from './UserProfilePosts';
import {EditProfile} from './EditUserProfile';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';
import {setDisplay} from '../../../utility/utility_functions';
import { Link, Redirect, Route, Switch } from 'react-router-dom';

function UserProfile (props) { 
    async function aysncCallToMountInformation(endpoint, username_belongingto_profile) {
        const spinner_div = document.getElementById('spinner_div_userprofiles');
        const user_not_found_container = document.getElementById('user_not_found_container');
        const resize_together_container = document.getElementById('resize_together_container');
        try {
            await checkTokenExpirationMiddleware(); 
            setDisplay(['block', 'none', 'none'], spinner_div, resize_together_container, user_not_found_container);
            
            const returned_profile_info_raw = await fetch(`/${username_belongingto_profile}/${endpoint}`, {
                headers: {
                    authorization: localStorage.getItem('accessToken')
                }
            }); 
            const returned_profile_info_json= await returned_profile_info_raw.json(); 
            if ("userUnauthorizedError" in returned_profile_info_json) {
                throw Error; 
            }
            else if ("userNotFound" in returned_profile_info_json) {
                setDisplay(['none', 'none', 'block'], spinner_div, resize_together_container, user_not_found_container);
            }
            else {
                setDisplay(['none', 'block', 'none'], spinner_div, resize_together_container, user_not_found_container);
                return returned_profile_info_json; 
            }
        }
        catch(err) {
            console.log(err);
            _authenticationErrorLogOut();
        }
    }

    

    return (
        <Switch>
            <Route exact path = '/:username/editProfile' render = {() =>
                <EditProfile 
                    current_user = {props.current_user} 
                    set_curr_user = {props.set_curr_user}
                /> 
            }/>

            <Route exact path = '/:username' render = {() => 
                 <main id = "user_profile_top_level_div">
                    <div id = "spinner_div_userprofiles" className="sk-chase sk-chase-userprofile">
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                        <div className="sk-chase-dot sk-chase-dot-userprofile"></div>
                    </div>
                    <div id = "user_not_found_container">
                        <h2>Sorry, this page isn't available.</h2>
                        <p>The link you followed may be broken, or the page may have been removed.</p>
                        <Link to ='/' id = "back_to_ig"><p>Go back to Instagram.</p></Link>
                    </div>
                    <div id = "resize_together_container">
                        <UserProfileInformation 
                            aysncCallToMountInformation = {aysncCallToMountInformation}
                        /> 
                        <UserProfileToggleViews /> 
                        <UserProfilePosts 
                            aysncCallToMountInformation = {aysncCallToMountInformation}
                        /> 
                    </div>
                </main>
            }/> 

            <Route path = '/' render = {() => 
                <Redirect to = {`/${props.current_user}`} /> 
            }/>
        </Switch>
    )
}


export {UserProfile}; 