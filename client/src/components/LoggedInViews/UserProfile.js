import React from 'react';


class UserProfile extends React.Component{
    constructor(props) {
        super(props); 
    }

    componentDidMount() {
        // fetch all information related to this user, if nothing found then
        // display appropriate message
        
    }

    render() {
        return(
            <div>
                <h1>user profile</h1>
            </div>
        )
    }
}

export {UserProfile}; 