import React from 'react';
import {Link} from 'react-router-dom';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

/**
 * This class represents a React class component responsible for rendering the section of the UI corresponding to the register page.
 * 
 * @class @public 
 */
class Register extends React.Component {
    constructor(props) {
        super(props);

        this._signUp = this._signUp.bind(this); 
    }

    componentDidMount() {
        document.getElementById('signup_button').disabled = true; 
        document.getElementsByClassName('validation_error')[0].style.display = 'none'; 
    }

    _register(e) {
        console.log(e);
    }

    _undisableSignupButton() {
        let form_inputs = [...document.getElementsByClassName('authInputs')];
        // filter out the signup_button from the array - don't need to verify its input 
        form_inputs = form_inputs.filter(x => x.classList.length <2); 
        const signup_button = document.getElementById('signup_button');

        for (let form_input_tag of form_inputs) {
            // password length must be longer than 5
            if ((form_input_tag.id === 'pw_input' && form_input_tag.value.length <= 5) || (form_input_tag.value.length < 1)) {
                signup_button.disabled = true; 
                signup_button.classList.add('inactive'); 
                return; 
            }
        }
        signup_button.disabled = false; 
        signup_button.classList.remove('inactive'); 
    }

    async _signUp() {
        const email_inp = document.getElementById('email_signup').value;
        const name_inp = document.getElementById('name_input').value;
        const username_inp = document.getElementById('username_input').value;
        const pw_inp = document.getElementById('pw_input').value;
        const date_of_birth_inp = document.getElementById('date_of_birth_input').value;
        const error_display = document.getElementsByClassName('validation_error')[0];
        // every time we send a new request, we want the error message displayed (if any) to be reset
        error_display.style.display = 'none'; 
        // we can ensure the email and username follow the correct format in the client, but in terms of making sure 
        // this email isn't already registered to a user, and the username isn't already taken, we'll have to send 
        // the POST to theserver and check 
        const is_email_valid = this._validateEmail(email_inp);
        const is_username_valid = this._validateUsername(username_inp); 
        const is_date_of_birth_valid = this._validateDateOfBirth(date_of_birth_inp); 
        if (is_email_valid && is_username_valid && is_date_of_birth_valid) {
            this._attemptToCreateUser(email_inp, name_inp, username_inp, pw_inp, date_of_birth_inp);
        }
        // if there are multiple errors with the validation, just address the first one and display error for that
        else if (!is_email_valid) {
            error_display.innerHTML = 'Please enter a valid email address'; 
            error_display.style.display = 'block';
        }

        else if (!is_username_valid) {
            error_display.innerHTML = 'Usernames can only use letters, numbers, underscores and periods';
            error_display.style.display = 'block';
        }

        else if (!is_date_of_birth_valid) {
            error_display.innerHTML = 'Please enter a valid date of birth';
            error_display.style.display = 'block';
        }
    }

    async _attemptToCreateUser(email, full_name, username_inp, pw_inp, date_of_birth) {
        // try to create the user if there are no issues in the backend
        try {
            let register_result = fetch('/register', {
                method: "POST",
                body: JSON.stringify({
                    email,
                    full_name, 
                    username_inp,
                    pw_inp,
                    date_of_birth
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                }
            }); 
        }
        catch (err) {
            console.log(err); 
        }
    } 


    _validateEmail(email_inp) {
        // must follow regex pattern xyz@__.com 
        const regex_pattern = /\S+@\S+\.\S+/;
        return regex_pattern.test(email_inp); 
    }

    _validateUsername(username_inp) {
        // Usernames can only use letters, numbers, underscores and periods.
        const regex_pattern = /^[a-zA-Z0-9_]+$/;
        return regex_pattern.test(username_inp); 
    }

    _validateDateOfBirth(date_of_birth) {
        const list_dob = date_of_birth.split('-'); 
        const yyyy = list_dob[0];
        
        if (yyyy > 2020 || yyyy < 1918) {
            return false; 
        }
        return true; 
    }


    _focus_text_input_to_date (e){
        e.currentTarget.type = "date";
    }

    _blur_date_input_to_text (e){
        e.currentTarget.type = "text";
        e.currentTarget.placeholder = "Date of Birth";
    }

    render() {
        return(
            <div id = "RegisterDiv" className = "auth_holder">
                <div className = "auth_info">
                    <div className = "name_form_auth">
                        <h1 className = "instagram_name">Instagram Clone</h1>
                        <h2 id = "signInDescr">Sign up to join in on the fun!</h2>
                        <form id = "RegisterForm" className = "form_auth" onChange = {this._undisableSignupButton}>
                            <input id = "email_signup" type = "email" placeholder = "Email" className = "authInputs"></input>
                            <input id = "name_input" type = "text" placeholder = "Full Name" className = "authInputs"></input>
                            <input id = "username_input" type = "text" placeholder = "Username" className = "authInputs"></input>
                            <input onFocus = {this._focus_text_input_to_date} onBlur={this._blur_date_input_to_text} id = "date_of_birth_input" type = "text" placeholder = "Date of Birth" className = "authInputs" ></input>
                            <input id = "pw_input" type = "password" placeholder = "Password" className = "authInputs"></input>
                            <button id = "signup_button" type ="button" onClick = {this._signUp} className = "authInputs submitButton inactive">
                                <h2 id = "signup_text" className = "submit_button_text">Sign Up</h2>
                                <div id = "anim_holder" className="sk-chase">
                                    <div className="sk-chase-dot"></div>
                                    <div className="sk-chase-dot"></div>
                                    <div className="sk-chase-dot"></div>
                                    <div className="sk-chase-dot"></div>
                                    <div className="sk-chase-dot"></div>
                                    <div className="sk-chase-dot"></div>
                                </div>
                            </button>
                        </form>
                        <div className = "validation_error_div">
                            <p className = "validation_error"></p>                       
                        </div>
                    </div>

                    <div className = "auth_link">
                        <p>Have an account? <Link to = "/">Log in</Link></p>
                    </div>
                </div>
            </div>
        )
    }
}

export {Register}; 