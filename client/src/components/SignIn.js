import React from 'react';


class SignIn extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div id = "register">
                <h1>Instagram Clone</h1>

                <form id = "sign_in">
                    <input type = "email" placeholder = "Email or username"></input>
                    <input type = "password" placeholder = "Password"></input>
                    <input type = "submit" placeholder = "Log In"></input>
                </form>
            </div>
        )
    }
}

export {SignIn}; 