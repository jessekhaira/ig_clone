import '../stylesheets/App.css';
import jwt_decode from "jwt-decode";
import React from 'react';
import {SignIn} from './SignIn';
import {Register} from './Register';
import {Footer} from './Footer';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {connect} from 'react-redux';
import {mapDispatchToProps_mainApp, mapStateToProps_mainApp} from '../redux/reactReduxMaps';
import {UserProfile} from './UserProfile';
import {NavBar} from './NavBar'; 
/**
 * This class represents a React Component that acts as the main wrapper for the components
 * for this application. In addition, this component is responsible for routing with react-router.
 * 
 * @class @public 
 */
class App extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // all of the user info can technically be stored in the local storage 
    // redux really just used for practice  
    if (localStorage.getItem('refreshToken')) {
      const curr_user = jwt_decode(localStorage.getItem('refreshToken'));
      if (this.props.current_user === '') {
        this.props.set_curr_user(curr_user.username); 
      }

      // refresh token expired, clear out local storage, if refresh token not expired
      // allow access to the protected views 
      if (curr_user.exp < Date.now() / 1000) {
        localStorage.clear(); 
      }
    }
  }


  _animate_input_labels(e) {
    const input_target = e.target;
    const label_input_target =input_target.nextElementSibling; 
    label_input_target.className = ''; 
    input_target.className = '';
    if (input_target.value.length === 0) {
        label_input_target.classList.add('label_input_auth');
        input_target.classList.add('authInputs');
    }
    else {
        label_input_target.classList.add('label_input_auth_written');
        input_target.classList.add('authInputsPlaceholderAnimPadding'); 
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
              
              <Switch>

                <Route exact path = '/:username' render = {(props) => {
                  <div>
                    <UserProfile /> 
                  </div>
                }}>
                </Route>

                <Route path = '/' render = {() => <Redirect to= {`/${this.props.current_user}`} />}>
                </Route>

              </Switch>

            </Router>
            :
            <Switch>

              <Route exact path = '/accounts/register'>
                <Register 
                _animate_input_labels = {this._animate_input_labels}
                register_user_logIn = {this.props.register_user_logIn}
                curr_user_status = {this.props.curr_user_status}
                curr_user_error = {this.props.curr_user_error}
                /> 
              </Route>

              <Route exact path = '/accounts/login'>
                <SignIn 
                _animate_input_labels = {this._animate_input_labels}
                logUserIn = {this.props.logUserIn}
                curr_user_status = {this.props.curr_user_status}
                curr_user_error = {this.props.curr_user_error}
                /> 
              </Route>

              <Route path = '/' render = {() =><Redirect to = '/accounts/login' />} />

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

const connectedComponent = connect(mapStateToProps_mainApp, mapDispatchToProps_mainApp)(App); 

export {connectedComponent as App}; 