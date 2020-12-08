import React from 'react';
import {Link} from 'react-router-dom';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {setDisplay, displayErrorInHTMLElement, _preprocess_loginbutton} from '../utility/utility_functions';

/**
 * This class represents a React class component responsible for rendering the section of the UI corresponding to the register page.
 * 
 * @class @public 
 */
class Register extends React.Component {
    constructor(props) {
        super(props);
        this._signUp = this._signUp.bind(this); 
        this._undisableSignupButton = this._undisableSignupButton.bind(this);
    }

    componentDidMount() {
        const signup_button = document.getElementById('signup_button');
        _preprocess_loginbutton(document.getElementById('signup_button'), this._signUp);
        document.getElementsByClassName('validation_error')[0].style.display = 'none'; 
    }


    componentDidUpdate() {
        if (this.props.curr_user_status === 'pending') {
            setDisplay(
                ['block', 'flex', 'none'], document.getElementById('anim_holder'), 
                document.getElementById('signup_button'),
                document.getElementById('signup_text')
            )
        }

        else if (this.props.curr_user_status === 'idle') {
            setDisplay(
                ['none', 'block', 'flex'], document.getElementById('anim_holder'), 
                document.getElementById('signup_button'),
                document.getElementById('signup_text')
            )
        }

        if (this.props.curr_user_error !== '') {
            const error_display = document.getElementsByClassName('validation_error')[0];
            displayErrorInHTMLElement(this.props.curr_user_error, error_display, 'block'); 
        }
        else if (this.props.curr_user_error === '') {
            const error_display = document.getElementsByClassName('validation_error')[0];
            error_display.style.display = 'none'; 
        }

    }

    _undisableSignupButton() {
        const signup_button = document.getElementById('signup_button');
        let inp_holders = [...document.getElementsByClassName('input_holder')];
        for (let inp_holder of inp_holders) {
            // password length must be longer than 5
            const form_input_tag = inp_holder.children[0];
            if (form_input_tag.value.length < 1 || (form_input_tag.id ==='pw_input' && form_input_tag.value.length <= 5)) {
                signup_button.disabled = true; 
                signup_button.classList.add('inactive'); 
                return; 
            }
        }
        signup_button.disabled = false; 
        signup_button.classList.remove('inactive'); 
        signup_button.addEventListener('click', this._signUp);
    }

    _signUp() {
        const email = document.getElementById('email_signup').value;
        const full_name = document.getElementById('name_input').value;
        const username = document.getElementById('username_input').value;
        const pw_inp = document.getElementById('pw_input').value;
        const date_of_birth = document.getElementById('date_of_birth_input').value;
        // we can ensure the email and username follow the correct format in the client
        const is_email_valid = this._validateEmail(email);
        const is_username_valid = this._validateUsername(username); 
        const is_date_of_birth_valid = this._validateDateOfBirth(date_of_birth); 
        if (is_email_valid && is_username_valid && is_date_of_birth_valid) {
            this.props.register_user_logIn({email, full_name, username, pw_inp, date_of_birth});
            return;
        }
        // if there are multiple errors with the validation, just address the first one and display error for that
        const error_display = document.getElementsByClassName('validation_error')[0];
        this._handleValidationError(error_display, is_email_valid, is_username_valid, is_date_of_birth_valid); 
    }

    _handleValidationError(error_display, is_email_valid, is_username_valid, is_date_of_birth_valid) {
        if (!is_email_valid) {
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
                            <div className = "input_holder">
                                <input id = "email_signup" type = "email" className = "authInputs" onChange = {this.props._animate_input_labels}></input>
                                <label htmlFor = "email_signup" className = "label_input_auth">Email</label>
                            </div>

                            <div className = "input_holder">
                                <input id = "name_input" type = "text" className = "authInputs" onChange = {this.props._animate_input_labels}></input>
                                <label htmlFor = "name_input" className = "label_input_auth">Full Name</label>
                            </div>

                            <div className = "input_holder">
                                <input id = "username_input" type = "text" className = "authInputs" onChange = {this.props._animate_input_labels}></input>
                                <label htmlFor = "username_input" className = "label_input_auth">Username</label>
                            </div>

                            <input onFocus = {this._focus_text_input_to_date} onBlur={this._blur_date_input_to_text} id = "date_of_birth_input" type = "text" placeholder = "Date of Birth" className = "authInputs" ></input>
                            
                            <div className = "input_holder">
                                <input id = "pw_input" type = "password"  className = "authInputs" onChange = {this.props._animate_input_labels}></input>
                                <label htmlFor = "pw_input" className = "label_input_auth">Password</label>
                            </div>

                            <button id = "signup_button" type ="button" className = "authInputs submitButton inactive">
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