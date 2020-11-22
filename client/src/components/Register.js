import React from 'react';
import {Link} from 'react-router-dom';

class Register extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id = "RegisterDiv" className = "auth_holder">
                <div className = "auth_info">
                
                    <div className = "name_form_auth">
                        <h1 className = "instagram_name">Instagram Clone</h1>
                        <h2>Sign up to join in on the fun!</h2>
                        <form id = "RegisterForm" className = "form_auth">
                            <input type = "email" placeholder = "Email" className = "authInputs"></input>
                            <input type = "text" placeholder = "Full Name" className = "authInputs"></input>
                            <input type = "text" placeholder = "Username" className = "authInputs"></input>
                            <input type = "password" placeholder = "Password" className = "authInputs"></input>
                            <input type = "submit" placeholder = "Sign Up" className = "authInputs"></input>
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