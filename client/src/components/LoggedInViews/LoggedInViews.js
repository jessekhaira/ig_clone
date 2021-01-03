import React from 'react';
import jwt_decode from "jwt-decode";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {UserProfile} from './UserProfile/UserProfile';
import {NavBar} from './NavBar/NavBar'; 
import {connect} from 'react-redux';
import {mapStateToProps_loggedInComponents,  mapDispatchToProps_loggedInComponents} from '../../redux/react-redux-maps/LoggedInReactRedux';
import {Explore} from './Explore';
import {HomePage} from './HomePage'; 
import {DMInbox} from './DMInbox';

class LoggedInViews extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // all of the user info can technically be stored in the local storage 
    // redux really just used for practice  
    const curr_user = jwt_decode(localStorage.getItem('refreshToken'));
    if (this.props.current_user === '') {
      this.props.set_curr_user(curr_user.username); 
    }
  }

  componentDidUpdate() {
    // if our state has updated and we've removed the refresh token from the local storage, 
    //notify the parent component by updating the parent components state 
    if (localStorage.getItem('refreshToken') === null) {
      this.props.child_parent_comm(false); 
    }
  }

  render() {
    return (
      <div className="LoggedInViews">
        <Router>
          <Route>
            <NavBar 
            current_user = {this.props.current_user}
            remove_curr_user = {this.props.remove_curr_user}
            /> 
          </Route>
              
          <Switch>

            <Route exact path = "/direct/inbox/" render = {(props) => (
              <DMInbox /> 
            )} /> 

            <Route exact path = '/explore' render = {(props) => 
              <Explore /> 
            } />

            <Route path = '/:username' render = {(props) => (
              <UserProfile 
                current_user = {this.props.current_user}
                set_curr_user = {this.props.set_curr_user}
              />
            )} /> 
            
            <Route path = '/accounts' render = {(props) => (
              <Redirect to = {`/${this.props.current_user}`} />
            )} />


            <Route path = '/' render = {(props) => (
              <HomePage /> 
            )} /> 

          </Switch>
        </Router>
      </div>
    )
  }
}

const connectedComponent = connect(mapStateToProps_loggedInComponents, mapDispatchToProps_loggedInComponents)(LoggedInViews);

export {connectedComponent as LoggedInViews}; 