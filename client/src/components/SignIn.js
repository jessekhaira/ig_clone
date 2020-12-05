import React from 'react';
import {Link} from "react-router-dom";
import {Register} from './Register';
import {setDisplay} from '../utility/utility_functions';


/**
 * This class represents a React class component responsible for rendering the section of the UI corresponding to the sign in page.
 * 
 * @class @public 
 */
class SignIn extends React.Component {
    constructor(props) {
        super(props);
        this._formInputsChanged = this._formInputsChanged.bind(this); 
        this._login = this._login.bind(this); 
    }

    componentDidMount() {
        this._preprocess_loginbutton();
    }

    _change_anim_placeholders(e) {
        const input_target = e.target;
        const label_input_target =input_target.nextElementSibling; 
        label_input_target.className = ''; 
        input_target.className = '';
        if (input_target.value.length === 0) {
            label_input_target.classList.add('label_input_auth');
            input_target.classList.add('authInputs');
        }
        else {
            label_input_target.classList.add('label_input_auth_written');
            input_target.classList.add('authInputsPlaceholderAnimPadding'); 
        }
    }

    /**
     * This method represents an asynchronous event listener for click events that occur for the login button. An HTTP POST request is sent 
     * to the server with the users information and if the information is valid, the user will be routed to their profile page.
     * @param {Event} e 
     */
    async _login(e) {
        // show the loader in the button
        try{
            const user_email_inp = document.getElementById('email_user_login').value;
            const pw_inp = document.getElementById('pw_login').value; 
            setDisplay(['none', 'block', 'flex'], document.getElementById('login_text'), 
                document.getElementById('anim_holder'), document.getElementById('login_button'));
            document.getElementById('login_button').disabled = true; 
            const error_display = document.getElementsByClassName('validation_error')[0];
            // every time we send a new request, we want the error message displayed (if any) to be reset
            error_display.style.display = 'none'; 
            const login_res = await this._tryToLogin(user_email_inp, pw_inp);
            if ("message" in login_res) {
                throw new Error(login_res.message);
            }
            const accessToken = login_res.accessToken;
            const refreshToken = login_res.refreshToken;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken); 
        }

        catch(err) {
            const err_message = String(err);
            const error_display = document.getElementsByClassName('validation_error')[0];
            this.props.displayErrorInHTMLElement(err_message, error_display, 'block'); 
        }

        finally {
            document.getElementById('login_button').disabled = false; 
            setDisplay(['flex', 'none', 'block'], document.getElementById('login_text'),
            document.getElementById('anim_holder'), document.getElementById('login_button'));
        }
    }

    async _tryToLogin(user_email_inp, pw_inp) {
        // send sensitive info to create new session as a POST req not GET or PUT 
        const fetchResults = await fetch('/accounts/login', {
            method: 'POST',
            body: JSON.stringify({
                username_or_email: user_email_inp,
                password: pw_inp
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        const jsonData = await fetchResults.json();
        return jsonData; 
    }

    _preprocess_loginbutton() {
        const loginButton = document.getElementById('login_button');
        loginButton.disabled = true; 
        loginButton.removeEventListener('click', this._login); 
    }

    _formInputsChanged() {
        const email_username_inp = document.getElementById('email_user_login');
        const pw_login = document.getElementById('pw_login');
        const loginButton = document.getElementById('login_button');
        if (email_username_inp.value.length >= 1 && pw_login.value.length > 5) {
            loginButton.disabled = false;
            loginButton.classList.remove('inactive'); 
            loginButton.addEventListener('click', this._login);
        }
        else {
            loginButton.disabled = true;
            loginButton.classList.add('inactive'); 
            loginButton.removeEventListener('click', this._login); 
        }
    }

    render() {
        return(
            <div id = "register" className = "auth_holder">
                <div className = "auth_info">
                    <div className = "name_form_auth">
                        <h1 className = "instagram_name">Instagram Clone</h1>
                        <form id = "sign_in" className = "form_auth" onChange = {this._formInputsChanged}>
                            <div className = "input_holder">
                                <input id = "email_user_login" type = "text" className = "authInputs" onChange = {this._change_anim_placeholders}></input>
                                <label htmlFor = "email_user_login" className = "label_input_auth">Username or email</label>
                            </div>
                            <div className = "input_holder">
                                <input id = "pw_login" type = "password" className = "authInputs" onChange = {this._change_anim_placeholders}></input>
                                <label htmlFor = "pw_login" className = "label_input_auth">Password</label>
                            </div>
                            <button id = "login_button" type ="button" className = "authInputs submitButton inactive">
                                <h2 id = "login_text" className = "submit_button_text">Log In</h2>
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
                        <p>Don't have an account?<Link to = "/register"> Sign up</Link></p>
                    </div>
                </div>
            </div>
        )
    }
}

export {SignIn}; 