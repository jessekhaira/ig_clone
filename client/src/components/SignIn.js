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
        this._preprocess_loginbutton()
    }

    /**
     * This method represents an asynchronous event listener for click events that occur for the login button. An HTTP POST request is sent 
     * to the server with the users information and if the information is valid, the user will be routed to their profile page.
     * @param {Event} e 
     */
    async _login(e) {
        // showe the loader in the button
        try{
            const user_email_inp = document.getElementById('email_user_login').value;
            const pw_inp = document.getElementById('pw_login').value; 
            setDisplay(['none', 'block', 'flex'], document.getElementById('login_text'), 
                document.getElementById('anim_holder'), document.getElementById('login_button'));
            document.getElementById('login_button').disabled = true; 
            const login_res = await this._tryToLogin(user_email_inp, pw_inp);
        }

        catch {
            console.log('err!');
        }

        finally {
            document.getElementById('login_button').disabled = false; 
            setDisplay(['flex', 'none', 'block'], document.getElementById('login_text'),
            document.getElementById('anim_holder'), document.getElementById('login_button'));
        }
    }

    async _tryToLogin(user_email_inp, pw_inp) {
        // send sensitive info to create new session as a POST req not GET or PUT 
        const fetchResults = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({
                username: user_email_inp,
                password: pw_inp
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });
        const jsonData = await fetchResults.json();
        console.log(jsonData); 
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
                            <input id = "email_user_login" type = "text" placeholder = "Email or username" className = "authInputs"></input>
                            <input id = "pw_login" type = "password" placeholder = "Password" className = "authInputs"></input>
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