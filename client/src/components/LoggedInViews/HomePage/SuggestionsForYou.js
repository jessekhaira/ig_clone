import React from 'react';


/**
 * This function represents a React component that renders the section of the homepage 
 * responsible for suggesting users to follow for the given user. 
 * @class @public 
 */
class SuggestionsForYouHomePage extends React.Component{
    constructor(props) {
        super(props); 
    }

    render() {
        return(
            <div id = 'suggestions_for_you_top_holder'>
            </div>
        )
    }
}

export {SuggestionsForYouHomePage}; 