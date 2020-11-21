import React from 'react';
import {Link} from 'react-router-dom';

class Register extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id = "RegisterDiv" className = "auth_holder">
                <h1 className = "instagram_name">Instagram Clone</h1>
                <h2>Sign up to join in on the fun!</h2>

                <form id = "RegisterForm" className = "form_auth">
                    <input type = "email" placeholder = "Email"></input>
                    <input type = "text" placeholder = "Full Name"></input>
                    <input type = "text" placeholder = "Username"></input>
                    <input type = "password" placeholder = "Password"></input>
                    <input type = "submit" placeholder = "Sign Up"></input>
                </form>

                <div id = "redirect_signIn">
                    <p>Have an account? <Link to = "/">Log in</Link></p>
                </div>
            </div>

        )
    }
}

export {Register}; 