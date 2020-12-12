import '../stylesheets/App.css';
import jwt_decode from "jwt-decode";
import React from 'react';
import {Footer} from './Footer';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {AuthorizationContainer} from './AuthorizationViews/AuthorizationContainer';
import {LoggedInViews} from './LoggedInViews/LoggedInViews';
/**
 * This class represents a React Component that acts as the main wrapper for the components
 * for this application. In addition, this component is responsible for routing with react-router.
 * 
 * @class @public 
 */
class App extends React.Component{
  constructor(props) {
    super(props);
    // want to be able to update this component based on state changes in the children component
    // and don't want to have to explicitly connect this component to redux store. IE if user logs in
    // the state changes and we want this component to re-render to start rendering the logged in views
    this.state = {loggedIn: false};
    this.child_parent_comm = this.child_parent_comm.bind(this); 
  }

  child_parent_comm (loggedIn) {
    this.setState((state, props) => ({
      loggedIn
    }));
  };


  componentDidMount() {
    if (localStorage.getItem('refreshToken')) {
      const curr_user = jwt_decode(localStorage.getItem('refreshToken'));
      // refresh token expired, clear out local storage, if refresh token not expired
      // allow access to the protected views 
      if (curr_user.exp < Date.now() / 1000) {
        localStorage.clear(); 
      }
    }
  }



  render() {
    return (
      <div className="App">
        <Router>
          {/* unless user is logged in, then none of the protected views will be shown -- has to be
          a refresh token in the local storage that isn't expired. We can also use the logged in status here*/}
          {localStorage.getItem('refreshToken') !== null ?
            <Router>
              <Route path = '/'>
                <LoggedInViews 
                child_parent_comm = {this.child_parent_comm} 
                /> 
              </Route>

            </Router>
            :

            <Switch>
              <Route path = '/accounts'>
                <AuthorizationContainer
                child_parent_comm = {this.child_parent_comm} 
                /> 
              </Route>

              <Route path = '/' render = {() =><Redirect to = '/accounts' />} />
            </Switch>
          }

          <Route>
            <Footer /> 
          </Route>

        </Router>
      </div>
    )
  }
}


export {App}; 