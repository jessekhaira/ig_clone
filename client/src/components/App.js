import '../stylesheets/App.css';
import jwt_decode from "jwt-decode";
import React from 'react';
import {Footer} from './Footer';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {NavBar} from './NavBar'; 
import {AuthorizationContainer} from './AuthorizationContainer';
import {LoggedInViews} from './LoggedInViews';
/**
 * This class represents a React Component that acts as the main wrapper for the components
 * for this application. In addition, this component is responsible for routing with react-router.
 * 
 * @class @public 
 */
class App extends React.Component{
  constructor(props) {
    super(props);
    // localStorage.clear(); 
  }

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
          a refresh token in the local storage that isn't expired*/}
          {localStorage.getItem('refreshToken') !== null ?
            <Router>

              <Route>
                <NavBar /> 
              </Route>
              
              <Route path = '/'>
                <LoggedInViews /> 
              </Route>

            </Router>
            :

            <Switch>
              <Route path = '/accounts'>
                <AuthorizationContainer /> 
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