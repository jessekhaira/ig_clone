import React from 'react';
import {Link} from "react-router-dom";
import {Register} from './Register';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id = "register" className = "auth_holder">
                <div className = "auth_info">
                    <div className = "name_form_auth">
                        <h1 className = "instagram_name">Instagram Clone</h1>
                        <form id = "sign_in" className = "form_auth">
                            <input type = "email" placeholder = "Email or username"></input>
                            <input type = "password" placeholder = "Password"></input>
                            <input type = "submit" placeholder = "Log In"></input>
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