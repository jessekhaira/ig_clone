import React from 'react';
import {Link} from 'react-router-dom';

class Register extends React.Component {
    constructor(props) {
        super(props);
    }

    _register(e) {
        console.log(e);
    }

    render() {
        return(
            <div id = "RegisterDiv" className = "auth_holder">
                <div className = "auth_info">
                
                    <div className = "name_form_auth">
                        <h1 className = "instagram_name">Instagram Clone</h1>
                        <h2 id = "signInDescr">Sign up to join in on the fun!</h2>
                        <form id = "RegisterForm" className = "form_auth">
                            <input type = "email" placeholder = "Email" className = "authInputs"></input>
                            <input type = "text" placeholder = "Full Name" className = "authInputs"></input>
                            <input type = "text" placeholder = "Username" className = "authInputs"></input>
                            <input type = "password" placeholder = "Password" className = "authInputs"></input>
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