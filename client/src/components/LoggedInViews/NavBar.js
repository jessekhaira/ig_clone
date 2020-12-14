import React from 'react'; 
import {Link, NavLink} from "react-router-dom";
import {withRouter} from 'react-router-dom';
import {ProfileIconSettings} from './ProfileIconSettings';
import {Notifications} from './Notifications';

/**
 * This class represents a React Component that represents the navigation
 * bar of the application, which will be shown to the user when logged in. 
 * @class @public 
 */
class NavBar extends React.Component{
    constructor(props) {
        super(props); 
        this._documentClickListener = this._documentClickListener.bind(this);
        this._setLocalStorageHighlight = this._setLocalStorageHighlight.bind(this); 

        this.mapping_for_highlightingIcons = {
            profile_settings: 'profile_img',
            profile_icon: 'profile_img', 
            link_home: 'home_icon',
            link_home_igname: 'home_icon',
            link_dm: 'dm_icon',
            link_explore: 'explore',
            notifications_div: 'notifications_icon'
        }; 
    }

    componentDidMount() {
        document.getElementById('profile_settings').style.display = 'none'; 
        document.addEventListener('click', this._documentClickListener);
        this._setHighlightOnMount();
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._documentClickListener); 
    }

    _setLocalStorageHighlight(e) {
        // just all the conditions for the tags that we want to highlight 
        console.log(e.target); 
        let new_highlight = null; 
        const target_id = e.target.id; 
        if (target_id in this.mapping_for_highlightingIcons) {
            new_highlight = this.mapping_for_highlightingIcons[target_id]; 
        }
        else {
            new_highlight = target_id; 
        }
        // edge case for notifications icon which should truly toggle when clicked twice
        this._unhighlightIcon(localStorage.getItem('curr_highlight_icon'));
        if (new_highlight === 'notifications_icon' && 'notifications_icon' === localStorage.getItem('curr_highlight_icon')) {
            localStorage.removeItem('curr_highlight_icon');
            return; 
        }
        localStorage.setItem('curr_highlight_icon', new_highlight);
        this._highlightIcon(new_highlight); 
    }


    _setHighlightOnMount() {
        const currHighlighted = localStorage.getItem('curr_highlight_icon');
        // null means first time component is being mounted, not on a refresh or 
        // anything so we set our profile icon to be highlighted since thats the first
        // logged in view users see 
        if (currHighlighted === null) {
            localStorage.setItem('curr_highlight_icon', 'profile_img'); 
            const profile_icon = document.getElementById('profile_img');
            profile_icon.style.border = '1px solid';
        }
        else {
            this._highlightIcon(localStorage.getItem('curr_highlight_icon'));
        }
    }

    _highlightIcon(item) {
        switch(item) {
            case 'profile_img':
            case 'dm_icon':
                document.getElementById(item).style.border = '1px solid';
                break;
            case 'home_icon':
                document.getElementById(item).style.webkitTextFillColor = 'black'; 
                break; 
            case 'explore':
                document.getElementById(item).style.webkitTextStrokeColor = 'black'; 
                break;
            case 'notifications_icon':
                document.getElementById(item).classList.toggle('fas');
                break
            default:
                return 
        }
    } 
    _unhighlightIcon(item) {
        switch(item) {
            case 'profile_img':
                document.getElementById(item).style.border = 'none';
                break;
            case 'explore':
                document.getElementById(item).style.webkitTextStrokeColor = 'white'; 
                break;
            case 'notifications_icon':
                document.getElementById(item).classList.toggle('fas');
                break
            default:
                return 
        }
    }


    _documentClickListener(e) {
        if (e.target.id !== 'profile_icon' && e.target.id !== 'profile_img' ) {
            document.getElementById('profile_settings').style.display = 'none'; 
            document.getElementsByClassName('top_triangle')[0].style.display = 'none';
        }
    }


    _searchBarFocus(e) {
        e.preventDefault();  
        const search_bar = document.getElementById('search_bar');
        const icon_input_div = document.getElementById('icon_input_div');
        document.getElementById('delete_inp_text_icon').style.display = 'block'; 
        // hide the div containing text, show the input tag
        const inp_tag = document.getElementById('search_input');
        inp_tag.style.display = 'block';
        inp_tag.focus(); 
        const inp_display_text = document.getElementById('inp_display_text');
        inp_display_text.style.display = 'none'; 
    }

    _searchBarBlur(e) {
        e.preventDefault(); 
        const search_bar = document.getElementById('search_bar');
        const icon_input_div = document.getElementById('icon_input_div');
        search_bar.style.justifyContent = 'center';
        icon_input_div.style.justifyContent = 'center';
        document.getElementById('delete_inp_text_icon').style.display = 'none'; 
        const inp_tag = document.getElementById('search_input');
        inp_tag.style.display = 'none';
        const inp_display_text = document.getElementById('inp_display_text');
        inp_display_text.style.display = 'block'; 
        inp_display_text.innerHTML = (inp_tag.value ? inp_tag.value: "Search"); 
    }

    _searchDelete(e) {
        e.preventDefault(); 
        e.stopPropagation(); 
        const search_bar = document.getElementById('search_bar');
        search_bar.blur(); 
        const inp_tag = document.getElementById('search_input');
        inp_tag.value = ''; 
    }



    render() {
        return(
            <div id = "navbar_container">
                <nav id = "navbar">
                    <Link id = "link_home_igname" to = '/'>
                        <div id = "ig_name">
                            <h1 id = "link_home_igname" className = "instagram_name">Instagram Clone</h1>
                        </div>
                    </Link>
                    
                    <div id = "search_bar" onMouseDown = {this._searchBarFocus} onBlur = {this._searchBarBlur}>
                        <div id = "icon_input_div">
                            <i class="fas fa-search search_icon"></i>
                            <div id = "inp_display_text" >Search</div>
                            <input id = "search_input" type = "text" placeholder = "Search"></input>
                            <i id = "delete_inp_text_icon" class="fas fa-times-circle position_icon" onClick = {this._searchDelete}></i>
                        </div>
                    </div>

                    <div id = "navbar_options">
                        <NavLink exact to = "/" id ="home_icon" activeClassName = "home_icon_active" className = "fas fa-home navbar_icons margin_class" 
                        />
                        <NavLink to = "/direct/inbox/" id = "dm_icon" className ="options_imgs margin_class far fa-paper-plane" activeClassName = "fas fa-paper-plane"
                        />                       
                        <NavLink id = "explore" to = "/explore"  className = "far fa-compass navbar_icons margin_class" activeClassName = "explore_active"
                        />

                        <Notifications 
                            _setLocalStorageHighlight = {this._setLocalStorageHighlight}
                        />
                        <ProfileIconSettings 
                            remove_curr_user = {this.props.remove_curr_user}
                            current_user = {this.props.current_user} 
                            _setLocalStorageHighlight = {this._setLocalStorageHighlight}
                            />
                    </div>
                </nav>
            </div>
        )
    }
}



const navbar_withrouter = withRouter(NavBar); 

export {navbar_withrouter as NavBar};  