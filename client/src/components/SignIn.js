import React from 'react';
import {Link} from "react-router-dom";
import {Register} from './Register';

class SignIn extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id = "register">
                <h1 className = "instagram_name">Instagram Clone</h1>

                <form id = "sign_in">
                    <input type = "email" placeholder = "Email or username"></input>
                    <input type = "password" placeholder = "Password"></input>
                    <input type = "submit" placeholder = "Log In"></input>
                </form>
                <div>
                    <p>Don't have an account?<Link to = "/register"> Sign up</Link></p>
                </div>
            </div>
        )
    }
}

export {SignIn}; 