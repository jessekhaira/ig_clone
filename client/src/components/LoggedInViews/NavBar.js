import React from 'react'; 
import {Link, NavLink} from "react-router-dom";
import {withRouter} from 'react-router-dom';
import {ProfileIconSettings} from './ProfileIconSettings';
import {Notifications} from './Notifications';
import { useLocation } from 'react-router-dom'

/**
 * This class represents a React Component that represents the navigation
 * bar of the application, which will be shown to the user when logged in. 
 * @class @public 
 */
class NavBar extends React.Component{
    constructor(props) {
        super(props); 
        this._documentClickListener = this._documentClickListener.bind(this);
        this._turnOnNotificationsLight = this._turnOnNotificationsLight.bind(this); 
        this._turnOffNotificationsLight = this._turnOffNotificationsLight.bind(this); 
        this._turnOnProfileLight = this._turnOnProfileLight.bind(this);
        this._turnOffProfileLight = this._turnOffProfileLight.bind(this); 
    }

    componentDidMount() {
        document.getElementById('profile_settings').style.display = 'none'; 
        document.addEventListener('click', this._documentClickListener);
        console.log(this.props.location.pathname); 
        this._highlightIconBasedOnRoute(this.props.location.pathname);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this._documentClickListener); 
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this._unHighlightIconBasedOnRoute(prevProps.location.pathname); 
            this._highlightIconBasedOnRoute(this.props.location.pathname); 
        }
    }


    _documentClickListener(e) {
        // just doing the event handling for filling in the heart icon here 
        // have to be able to turn off the heart icon when user clicks anywhere off the heart
        // so it makes sense to do it here 
        if (e.target.id === 'notifications_div' || e.target.id === 'notifications_icon') {
            this._turnOnNotificationsLight(); 
        }
        else if (e.target.id !== 'notifications_div' || e.target.id !== 'notifications_icon') {
            this._turnOffNotificationsLight(); 
        }

        // have to also handle the user profile component as well here
        // circle user profile and uncircle it as user clicks from any place on the navbar
        // making sure to leave it circled if the user is currently viewing their profile 
        if (e.target.id === 'profile_icon' || e.target.id === 'profile_img') {
            console.log('asdasd');
            this._turnOnProfileLight();
        }
        else if (e.target.id !== 'profile_icon' || e.target.id !== 'profile_img' ) {
            document.getElementById('profile_settings').style.display = 'none'; 
            document.getElementsByClassName('top_triangle')[0].style.display = 'none';
            this._turnOffProfileLight();
        }
    }

    _highlightIconBasedOnRoute(endpoint) {
        switch (endpoint) {
            case '/explore':
                document.getElementById('explore').classList.add('fas');
                break;
            case '/direct/inbox/':
                document.getElementById('dm_icon').classList.add('fas');
                break
            case '/':
                document.getElementById('home_icon').classList.add('home_icon_active');
                break
            default: 
                document.getElementById('profile_img').style.border = '1px solid';
        }
    }

    _unHighlightIconBasedOnRoute(endpoint) {
        switch (endpoint) {
            case '/explore':
                document.getElementById('explore').classList.remove('fas');
                break
            case '/direct/inbox/':
                document.getElementById('dm_icon').classList.remove('fas');
                 break
            case '/':
                document.getElementById('home_icon').classList.remove('home_icon_active');
                break 
            default:
                document.getElementById('profile_img').style.border = 'none'; 
        }
    }

    _turnOnNotificationsLight() {
        const notif_icon = document.getElementById('notifications_icon');
        const already_turned_on = notif_icon.classList.contains('fas');
        // already turned on is same logic as turn off notif light 
        if (already_turned_on) {
            return this._turnOffNotificationsLight(); 
        }
        document.getElementById('notifications_icon').classList.add('fas'); 
        const endpoint = this.props.location.pathname;
        this._unHighlightIconBasedOnRoute(endpoint);
    }

    _turnOffNotificationsLight() {
        // clicking anywhere outside notifications turns off the notifications light
        // and turns on the light of the endpoint we are currently on 
        const notif_icon = document.getElementById('notifications_icon');
        // if its already turned on and we click it again, then we turn it off
        // and 
        const already_turned_on = notif_icon.classList.contains('fas');
        // notif is already off, no need to do anything 
        if (!already_turned_on) {
            return; 
        }
        notif_icon.classList.remove('fas');
        const endpoint = this.props.location.pathname;
        this._highlightIconBasedOnRoute(endpoint); 
    }

    _turnOnProfileLight() {
        document.getElementById('profile_img').style.border = '1px solid'; 
        if (this._routesNotForUserProfile(this.props.location.pathname))  {
            this._unHighlightIconBasedOnRoute(this.props.location.pathname); 
        }       
    }
    
    _turnOffProfileLight() {
        // you turn off the profile light if you aren't currently on /:username endpoint 
        if (this._routesNotForUserProfile(this.props.location.pathname)) {
            document.getElementById('profile_img').style.border = 'none'; 
            this._highlightIconBasedOnRoute(this.props.location.pathname);
        }                
    }

    _routesNotForUserProfile(location) {
        if (
            location === '/' ||
            location === '/direct/inbox/' ||
            location === '/explore'
        ) {
            return true;
        }
        return false; 
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
                        <Link to = "/">
                            <i id = "home_icon" className="fas fa-home navbar_icons margin_class"></i>
                        </Link>

                        <Link to = "/direct/inbox/">
                            <i id = "dm_icon" className ="options_imgs margin_class far fa-paper-plane"></i>
                        </Link>
                       
                        <Link to = "/explore">
                            <i id = "explore" className="far fa-compass navbar_icons margin_class"></i>
                        </Link>
                        <Notifications 
                            _setLocalStorageHighlight = {this._setLocalStorageHighlight}
                        />
                        <ProfileIconSettings 
                            remove_curr_user = {this.props.remove_curr_user}
                            current_user = {this.props.current_user} 
                            />
                    </div>
                </nav>
            </div>
        )
    }
}





const navbar_withrouter = withRouter(NavBar); 

export {navbar_withrouter as NavBar};  