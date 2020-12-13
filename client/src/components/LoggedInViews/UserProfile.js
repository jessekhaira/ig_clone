import React from 'react';


/**
 * This class represents a React Component that renders the template for
 * a users personal profile.  
 * @class @public 
 */
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