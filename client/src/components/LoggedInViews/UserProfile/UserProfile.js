import React, { useEffect, useState } from 'react';
import {UserProfileInformation} from './UserProfileInformation';
import {UserProfileToggleViews} from './UserProfileToggleViews';
import {UserProfilePosts} from './UserProfilePosts';
import {EditProfile} from './EditUserProfile';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, infiniteScroll} from '../../../utility/utility_functions';
import {setDisplay} from '../../../utility/utility_functions';
import { Link, Redirect, Route, Switch, useHistory } from 'react-router-dom';

function UserProfile (props) { 
    const history = useHistory();

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
                            current_user = {props.current_user} 
                        /> 
                        <UserProfileToggleViews 
                            current_user = {props.current_user} 
                        /> 
                        <UserProfilePosts 
                            current_user = {props.current_user} 
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