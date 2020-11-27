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
    }

    componentDidMount() {
        document.getElementById('signup_button').disabled = true; 
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
        const email_inp = document.getElementById('email_signup');
        const name_inp = document.getElementById('name_input');
        const username_inp = document.getElementById('username_input');
        const pw_inp = document.getElementById('pw_input'); 

        // we can ensure the email and username follow the correct format in the client, but in terms of making sure 
        // this email isn't already registered to a user, and the username isn't already taken, we'll have to send 
        // the POST to theserver and check 
        const is_email_valid = this._validateEmail(email_inp);
        const is_username_valid = this._validateUsername(username_inp); 
        if (is_email_valid) {
            this._attemptToCreateUser(email_inp.value, name_inp.value, username_inp.value, pw_inp.value);
        }
    }

    _validateEmail() {

    }

    _validateUsername() {
        // Usernames can only use letters, numbers, underscores and periods.
    }

    _attemptToCreateUser(email, full_name, username_inp, pw_inp) {
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