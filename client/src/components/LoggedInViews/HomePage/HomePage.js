import React from 'react';
import {HomePagePosts} from './HomePagePosts';
import {SuggestionsForYouHomePage} from './SuggestionsForYou';

/**
 * This class represents a React Component that renders the template for
 * a users home page. 
 * @class @public 
 */
class HomePage extends React.Component{
    constructor(props) {
        super(props); 
    }

    render() {
        return(
            <div id = "home_page_div">
                <HomePagePosts />
                <SuggestionsForYouHomePage /> 
            </div>
        )
    }
}

export {HomePage}; 