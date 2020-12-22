import React, { useEffect, useRef, useState } from 'react';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut} from '../../../utility/utility_functions';

function EditProfile(props) { 

    useEffect(() => {
        async function fetchEditProfileInfo() {
            try {
                await checkTokenExpirationMiddleware(); 
                const returned_profile_info_raw = await fetch(`/${props.current_user}/editProfile`, {
                    headers: {
                        authorization: localStorage.getItem('accessToken')
                    }
                }); 
                const returned_profile_info_json= await returned_profile_info_raw.json(); 
                console.log(returned_profile_info_json);

                initEditComponent(returned_profile_info_json); 
            }
            catch(err) {
                // weird failed to fetch response on page reloads when it doesn't actually fail
                // just ignoring the error for now
                if (String(err).includes('failed')) {
                    _authenticationErrorLogOut(); 
                }
            }
        }
        fetchEditProfileInfo(); 
    });

    function initEditComponent(init_object) {
        const base64_image = 'data:image/jpeg;base64,' + init_object.profile_picture.profile_picture;
        document.getElementById('edit_profile_profilepic').src = base64_image;
        document.getElementById('change_name').value = init_object.full_name;
        document.getElementById('change_username').value = props.current_user; 
        document.getElementById('change_bio').value = (init_object.profile_description === null ? '': init_object.profile_description);
        document.getElementById('change_email').value = init_object.email; 
    }

    function updateProfileClick(e) {
        // if (validUpdateInputs()) {

        //     const update_user = fetch(`/${props.current_user}/editProfile`, {
        //         method: 'PUT',

        //     }
        // }

    }

    return (
        <div id = 'edit_profile_topleveldiv'>
            <form id = 'edit_profile_form'>
                <div id = "edit_profile_header">
                    <div id = "username_profilepicture_div">
                        <img id = 'edit_profile_profilepic'></img>
                        <h3>{props.current_user}</h3>
                    </div>
                    <label htmlFor = "update_profile_picture" className = "edit_profile_labels">Change Profile Photo</label>
                    <input type="file" id="img_input" name="img" accept="image/*" />
                </div>
                <div className = "edit_profile_div">
                    <div className = "labeldiv_editprofile">
                        <label htmlFor = "change_name" className = "edit_profile_labels">Name</label>
                    </div>
                    <div className = "inputdiv_editprofile">
                        <input type = "text" placeholder = "Name" id = "change_name" className = "edit_profile_names"></input>
                    </div>
                </div>

                <div className = "edit_profile_div">
                    <div className = "labeldiv_editprofile">
                        <label htmlFor = "change_username" className = "edit_profile_labels">Username</label>
                    </div>
                    <div className = "inputdiv_editprofile">
                        <input type = "text" placeholder = "Username" id = "change_username" className = "edit_profile_names"></input>
                    </div>
                </div>

                <div className = "edit_profile_div">
                    <div className = "labeldiv_editprofile">
                        <label htmlFor = "change_bio" className = "edit_profile_labels">Bio</label>
                    </div>
                    <div className = "inputdiv_editprofile">
                        <textarea type = "textarea" id = "change_bio" className = "edit_profile_names"></textarea>
                    </div>
                </div>

                <div className = "edit_profile_div">
                    <div className = "labeldiv_editprofile">
                        <label htmlFor = "change_email" className = "edit_profile_labels">Email</label>
                    </div>
                    <div className = "inputdiv_editprofile">
                        <input type = "email" placeholder = "Email" id = "change_email" className = "edit_profile_names"></input>
                    </div> 
                </div>
                <div id = "profile_buttons">
                    <button id = "submit_editprofile" className = "edit_profile_buttons" onClick = {updateProfileClick}>Submit</button>
                    <button id = "goback_editprofile" className = "edit_profile_buttons">Go Back</button>
                </div>
            </form>
        </div>
    )
}


export {EditProfile}; 