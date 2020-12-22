import React, { useEffect, useRef, useState } from 'react';
import {UserProfileInformation} from './UserProfileInformation';
import {UserProfileToggleViews} from './UserProfileToggleViews';
import {UserProfilePosts} from './UserProfilePosts';
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
            _authenticationErrorLogOut();
        }
    }

    useEffect(() => {
        async function fetchProfileIcon() {
            try {
                await checkTokenExpirationMiddleware(); 
                const returned_icon = await fetch('/loggedIn/navbar/getProfileIcon', {
                    headers: {
                        authorization: localStorage.getItem('accessToken')
                    }
                });
                const json_icon = await returned_icon.json();
                const base64profilepic = json_icon.profile_picture[0].profile_picture; 
                document.getElementById('edit_profile_profilepic').src = 'data:image/jpeg;base64,' + base64profilepic; 
            }
            catch(err) {
                _authenticationErrorLogOut();
            }
        }
        if(document.getElementById('edit_profile_profilepic') !== null) {
            fetchProfileIcon(); 
        } 
    })

    return (
        <Switch>
            <Route exact path = '/:username/editProfile' render = {() =>
                <div id = 'edit_profile_topleveldiv'>
                    <form id = 'edit_profile_form'>
                        <div id = "edit_profile_header">
                            <div id = "username_profilepicture_div">
                                <img id = 'edit_profile_profilepic'></img>
                                <h3>{props.current_user}</h3>
                            </div>
                            <label for = "update_profile_picture" className = "edit_profile_labels">Change Profile Photo</label>
                            <input type="file" id="img_input" name="img" accept="image/*" />
                        </div>
                        <div className = "edit_profile_div">
                            <div className = "labeldiv_editprofile">
                                <label for = "change_name" className = "edit_profile_labels">Name</label>
                            </div>
                            <div className = "inputdiv_editprofile">
                                <input type = "text" placeholder = "Name" id = "change_name" className = "edit_profile_names"></input>
                            </div>
                        </div>

                        <div className = "edit_profile_div">
                            <div className = "labeldiv_editprofile">
                                <label for = "change_username" className = "edit_profile_labels">Username</label>
                            </div>
                            <div className = "inputdiv_editprofile">
                                <input type = "text" placeholder = "Username" id = "change_username" className = "edit_profile_names"></input>
                            </div>
                        </div>

                        <div className = "edit_profile_div">
                            <div className = "labeldiv_editprofile">
                                <label for = "change_bio" className = "edit_profile_labels">Bio</label>
                            </div>
                            <div className = "inputdiv_editprofile">
                                <textarea type = "textarea" id = "change_bio" className = "edit_profile_names"></textarea>
                            </div>
                        </div>

                        <div className = "edit_profile_div">
                            <div className = "labeldiv_editprofile">
                                <label for = "change_email" className = "edit_profile_labels">Email</label>
                            </div>
                            <div className = "inputdiv_editprofile">
                                <input type = "email" placeholder = "Email" id = "change_email" className = "edit_profile_names"></input>
                            </div> 
                        </div>
                        <div id = "profile_buttons">
                            <button id = "submit_editprofile" className = "edit_profile_buttons">Submit</button>
                            <button id = "goback_editprofile" className = "edit_profile_buttons">Go Back</button>
                        </div>
                    </form>
                </div>
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