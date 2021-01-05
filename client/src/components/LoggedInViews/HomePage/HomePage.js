import React from 'react';
import {HomePagePosts} from './HomePagePosts';
import {HomePageStories} from './HomePageStories';
import {SuggestionsForYouHomePage} from './SuggestionsForYou';

/**
 * This class represents a React Component that renders a users home page. 
 * @class @public 
 */
class HomePage extends React.Component{
    constructor(props) {
        super(props); 
    }

    render() {
        return(
            <div id = "home_page_div">
                <div id = 'posts_stories_holder'>
                    <HomePageStories /> 
                    <HomePagePosts
                        current_user = {this.props.current_user}
                    />
                </div>
                <SuggestionsForYouHomePage /> 
            </div>
        )
    }
}

export {HomePage}; 