import React from 'react';


class UserProfile extends React.Component{
    constructor(props) {
        super(props); 
        console.log(this.props.location);
    }

    render() {
        return(
            <h1>User Profile</h1>
        )
    }
}

export {UserProfile}; 