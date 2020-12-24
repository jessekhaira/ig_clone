import React, { useEffect} from 'react';
import { useHistory } from 'react-router';
import {checkTokenExpirationMiddleware, _authenticationErrorLogOut, _validateEmail, _validateUsername, setDisplay} from '../../../utility/utility_functions';

/**
 * This function represents a react functional component containing all the logic and jsx related
 * to the user being able to edit their own profile. 
 */
function EditProfile(props) { 
    const history = useHistory(); 
    
    /**
     * This effect is called every single time the component is mounted, and makes an async request
     * to the backend to retrieve all the information for the user to fill out the form within this 
     * component, as the main purpose of this component is to allow the user to edit their already 
     * existing data (profile picture, database, etc). 
     */
    useEffect(() => {
        async function fetchEditProfileInfo() {
            const spinner_form = document.getElementById('spinner_div_form');
            const form_elements = document.getElementById('form_elements_editprofile'); 
            try {
                setDisplay(['block', 'none'], spinner_form, form_elements);
                await checkTokenExpirationMiddleware(); 
                const returned_profile_info_raw = await fetch(`/${props.current_user}/editProfile`, {
                    headers: {
                        authorization: localStorage.getItem('accessToken')
                    }
                }); 
                const returned_profile_info_json= await returned_profile_info_raw.json();
                // user failed to authenticate properly, log the user out as a result 
                if ('UnauthorizedUser' in returned_profile_info_json) {
                    throw Error('UnauthorizedUser'); 
                } 
                initEditComponent(returned_profile_info_json); 
            }
            catch(err) {
                if (String(err).includes('UnauthorizedUser')) {
                    _authenticationErrorLogOut(); 
                }
            }

            finally {
                setDisplay(['flex', 'none'], form_elements, spinner_form); 
            }
        }
        fetchEditProfileInfo(); 
    });

    /**
     * This function recieves an object with all the data this component needs to be mounted, and then
     * accesses the correct DOM elements and fills out the data within them. 
     */
    function initEditComponent(init_object) {
        const base64_image = 'data:image/jpeg;base64,' + init_object.profile_picture.profile_picture;
        document.getElementById('edit_profile_profilepic').src = base64_image;
        document.getElementById('change_name').value = init_object.full_name;
        document.getElementById('change_username').value = props.current_user; 
        document.getElementById('change_bio').value = (init_object.profile_description === null ? '': init_object.profile_description);
        document.getElementById('change_email').value = init_object.email; 
    }

    /**
     * This function takes the data the user has filled out in the edit profile form and sends a PUT
     * request to the appropriate API endpoint on the server. The data passed into the form first goes
     * through a javascript validation to ensure all values are provided in an appropriate format,
     * and then if the username and email aren't already being used, the users information will update. 
     */
    async function updateProfileClick(e) {
        e.preventDefault();
        const spinner_div = document.getElementById('spinner_div_editprofile');
        const submit_p_tag = document.getElementById('submit_descr');
        const error_success_div = document.getElementById('error_success_div');
        error_success_div.innerHTML = ''; 
        if (checkIfInputsValid()) {
            try {
                await checkTokenExpirationMiddleware(); 
                setDisplay(['block', 'none'], spinner_div, submit_p_tag); 
                const res = await fetch(`/${props.current_user}/editProfile`, {
                    method: 'PUT',
                    headers: {
                        authorization: localStorage.getItem('accessToken'),
                        'Content-type': 'application/json; charset=UTF-8'
                    },
                    body: JSON.stringify({
                        fullname: document.getElementById('change_name').value,
                        username: document.getElementById('change_username').value,
                        email: document.getElementById('change_email').value,
                        profile_bio: document.getElementById('change_bio').value 
                    })
                });
                
                const json_res = await res.json(); 
                // error conditions -- handle appropriately in catch
                if ("UnauthorizedUser" in json_res || "DuplicateEmail" in json_res ||
                    "DuplicateUsername" in json_res) {
                        throw Error(Object.keys(json_res)[0]);
                }
                // we've updated our username so we need new refresh and access tokens 
                // as the payload in the old ones will be stale -- main thing held in tokens
                // will be the usernames 
                else if (props.current_user !== document.getElementById('change_username').value) {
                    localStorage.setItem('accessToken', json_res.accessToken);
                    localStorage.setItem('refreshToken', json_res.refreshToken);
                    props.set_curr_user(document.getElementById('change_username').value); 
                }
                error_success_div.innerHTML = 'Success!';
                error_success_div.style.color = 'green'; 

            }
            catch(err) {
                err = String(err);
                putRequestFailedError(err); 
            }
            finally {
                setDisplay(['none', 'block'], spinner_div, submit_p_tag); 
            }
        }
    }

    function putRequestFailedError(err) {
        const error_success_div = document.getElementById('error_success_div');
        error_success_div.style.color = 'red'; 
        if (err.includes('UnauthorizedUser')) {
            _authenticationErrorLogOut(); 
        }
        else if (err.includes('DuplicateEmail')) {
            error_success_div.innerHTML = 'Email address is already registered. Select another one.';
        }
        else if (err.includes('DuplicateUsername')) {
            error_success_div.innerHTML = 'Username is already registered. Select another one. '
        }
    }

    /**
     * Function used to validate the inputs the user passes to update their profile. If any of the 
     * validations fails, appropriate error is displayed inside the component. 
     */
    function checkIfInputsValid() {
        const error_success_div = document.getElementById('error_success_div');
        error_success_div.style.color = 'red'; 
        if(document.getElementById('change_name').value.length <1) {
            error_success_div.innerHTML = 'Name must have atleast one character.'
            return false; 
        }
        else if (document.getElementById('change_bio').value.length >150) {
            error_success_div.innerHTML = 'Bio must be less than or equal to 150 characters.'
            return false; 
        }
        else if (!_validateUsername(document.getElementById('change_username').value)) {
            error_success_div.innerHTML = 'Username must have atleast one character and contain only letters, numbers, underscores and periods.';
            return false; 
        }

        else if (!_validateEmail(document.getElementById('change_email').value)) {
            error_success_div.innerHTML = 'Please enter a valid email.';
            return false; 
        }
        return true; 
    }

    function goBackPrevPage(e) {
        e.preventDefault(); 
        history.push(`/${props.current_user}`); 
    }


    function redirectClickInput(e) {
        document.getElementsByClassName('photo_upload_inputs')[0].click(); 
    }

    async function uploadPhoto(e) {
        const photo_spinner = document.getElementById('spinner_div_picedit');
        const img_displayed = document.getElementById('edit_profile_profilepic');
        try {
            setDisplay(['block', 'none'], photo_spinner, img_displayed); 
            const img = e.target.files[0]; 
            let formInfo = new FormData();
            formInfo.append('image', img); 
            let uploadStatusRaw = await fetch(`/${props.current_user}/profilePhoto`, {
                method: 'PUT',
                headers: {
                    authorization: localStorage.getItem('accessToken')
                },
                body: formInfo
            });
            let json_uploadStatus = await uploadStatusRaw.json();
            if ('UnauthorizedUser' in json_uploadStatus) {
                throw Error('UnauthorizedUser')
            }
            showNewProfilePicture(e.target.files[0]);
        }

        catch(err) {
            err = String(err);
            if (err.includes('UnauthorizedUser')) {
                _authenticationErrorLogOut();
            }
        }
        finally {
            setDisplay(['block', 'none'], img_displayed, photo_spinner);
        }
    }

    function showNewProfilePicture(file) {
        const filereader = new FileReader();
        filereader.onload = () => {
            document.getElementById('edit_profile_profilepic').src = filereader.result; 
        }
        filereader.readAsDataURL(file);
    }

    return (
        <div id = 'edit_profile_topleveldiv'>
            <form id = 'edit_profile_form'>
                <div id = "spinner_div_form" className="sk-chase sk-chase-picedit">
                    <div className="sk-chase-dot sk-chase-dot-formspinner"></div>
                    <div className="sk-chase-dot sk-chase-dot-formspinner"></div>
                    <div className="sk-chase-dot sk-chase-dot-formspinner"></div>
                    <div className="sk-chase-dot sk-chase-dot-formspinner"></div>
                    <div className="sk-chase-dot sk-chase-dot-formspinner"></div>
                    <div className="sk-chase-dot sk-chase-dot-formspinner"></div>
                </div>
                <div id = "form_elements_editprofile">
                    <div id = "edit_profile_header">
                        <div id = "username_profilepicture_div">
                            <div id = "spinner_div_picedit" className="sk-chase sk-chase-picedit">
                                <div className="sk-chase-dot sk-chase-dot-profilepicspinner"></div>
                                <div className="sk-chase-dot sk-chase-dot-profilepicspinner"></div>
                                <div className="sk-chase-dot sk-chase-dot-profilepicspinner"></div>
                                <div className="sk-chase-dot sk-chase-dot-profilepicspinner"></div>
                                <div className="sk-chase-dot sk-chase-dot-profilepicspinner"></div>
                                <div className="sk-chase-dot sk-chase-dot-profilepicspinner"></div>
                            </div>
                            <img id = 'edit_profile_profilepic'></img>
                            <h3>{props.current_user}</h3>
                        </div>
                        <label htmlFor = "update_profile_picture" className = "edit_profile_labels" onClick = {redirectClickInput}>Change Profile Photo</label>
                        <input type="file" id="img_input" name="img" className = "photo_upload_inputs" accept="image/*" onChange = {uploadPhoto} />
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

                    <div id = "error_success_div"></div>
                    <div id = "profile_buttons">
                        <button id = "submit_editprofile" className = "edit_profile_buttons" onClick = {updateProfileClick}>
                            <p id = "submit_descr">Submit</p>
                            <div id = "spinner_div_editprofile" className="sk-chase sk-chase-editprofile">
                                <div className="sk-chase-dot sk-chase-dot-editprofile"></div>
                                <div className="sk-chase-dot sk-chase-dot-editprofile"></div>
                                <div className="sk-chase-dot sk-chase-dot-editprofile"></div>
                                <div className="sk-chase-dot sk-chase-dot-editprofile"></div>
                                <div className="sk-chase-dot sk-chase-dot-editprofile"></div>
                                <div className="sk-chase-dot sk-chase-dot-editprofile"></div>
                            </div>
                        </button>
                        <button id = "goback_editprofile" className = "edit_profile_buttons" onClick = {goBackPrevPage}>Go Back</button>
                    </div>
                </div>
            </form>
        </div>
    )
}


export {EditProfile}; 