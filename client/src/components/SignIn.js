import React from 'react';
import {Link} from "react-router-dom";
import {Register} from './Register';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this._preprocess_loginbutton()
    }

    _login(e) {
        console.log(e); 
    }

    _preprocess_loginbutton() {
        const loginButton = document.getElementById('login_button');
        loginButton.disabled = true; 
        loginButton.removeEventListener('click', this._login); 
    }

    _change() {
        const email_username_inp = document.getElementById('email_user_login');
        const pw_login = document.getElementById('pw_login');
        const loginButton = document.getElementById('login_button');
        if (email_username_inp.value.length > 1 && pw_login.value.length > 5) {
            loginButton.disabled = false;
            loginButton.classList.remove('inactive'); 
        }
        else {
            loginButton.disabled = true;
            loginButton.classList.add('inactive'); 
        }
    }

    render() {
        return(
            <div id = "register" className = "auth_holder">
                <div className = "auth_info">
                    <div className = "name_form_auth">
                        <h1 className = "instagram_name">Instagram Clone</h1>
                        <form id = "sign_in" className = "form_auth" onChange = {this._change}>
                            <input id = "email_user_login" type = "text" placeholder = "Email or username" className = "authInputs"></input>
                            <input id = "pw_login" type = "password" placeholder = "Password" className = "authInputs"></input>
                            <button id = "login_button" type ="button" className = "authInputs submitInp inactive">Log In</button>
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