import React from 'react';
import jwt_decode from "jwt-decode";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {UserProfile} from './UserProfile';
import {NavBar} from './NavBar'; 
import {connect} from 'react-redux';
import {mapStateToProps_loggedInComponents,  mapDispatchToProps_loggedInComponents} from '../redux/react-redux-maps/LoggedInReactRedux';

class LoggedInViews extends React.Component{
  constructor(props) {
    super(props);
    
    this.state = {currEndpoint:''}; 
    this._changeInEndpoint_ReRenderViews = this._changeInEndpoint_ReRenderViews.bind(this); 
  }

  _changeInEndpoint_ReRenderViews(newEndpoint) {
    this.setState((state, props) => ({
      currEndpoint: newEndpoint
    })); 
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
            _changeInEndpoint_ReRenderViews = {this._changeInEndpoint_ReRenderViews} 
            /> 
          </Route>
              
          <Switch>
              <Route exact path = '/:username' render = {(props) => {
                  <UserProfile /> 
              }}>
              </Route>

              <Route exact path = '/explore' render = {(props) => {
                <div>
                  <h1>ASDAS</h1>
                </div>
              }} /> 

              <Route path = '/' render = {() => <Redirect to= {`/${this.props.current_user}`} />}>
              </Route>

          </Switch>
        </Router>
      </div>
    )
  }
}

const connectedComponent = connect(mapStateToProps_loggedInComponents, mapDispatchToProps_loggedInComponents)(LoggedInViews);

export {connectedComponent as LoggedInViews}; 