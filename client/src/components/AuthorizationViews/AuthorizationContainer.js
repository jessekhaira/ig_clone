import jwt_decode from "jwt-decode";
import React from 'react';
import {SignIn} from './SignIn';
import {Register} from './Register';
import {BrowserRouter as Router, Switch, Route, Redirect, useRouteMatch} from "react-router-dom";
import {connect} from 'react-redux';
import {mapDispatchToProps_authComponents,  mapStateToProps_authComponents} from '../../redux/react-redux-maps/AuthorizationReactRedux';


class AuthorizationContainer extends React.Component{
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    // state has updated doesn't mean user has logged in -- we could have an error
    // so we base off the refresh token in the local storage. If it is set, we notify 
    // the parent app container to re-render by updating its state because we have successfully 
    // logged in -- refresh token has been set succesfully,
    if(localStorage.getItem('refreshToken') !== null) {
      this.props.child_parent_comm(true); 
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
      <div className="AuthorizationContainer">
        <Router>
            <Switch>
                <Route exact path = '/accounts/login'>
                  <SignIn
                  _animate_input_labels = {this._animate_input_labels}
                  logUserIn = {this.props.logUserIn}
                  curr_user_status = {this.props.curr_user_status}
                  curr_user_error = {this.props.curr_user_error}
                  /> 
                </Route>

                <Route exact path = '/accounts/register'>
                  <Register 
                      _animate_input_labels = {this._animate_input_labels}
                      register_user_logIn = {this.props.register_user_logIn}
                      curr_user_status = {this.props.curr_user_status}
                      curr_user_error = {this.props.curr_user_error}
                      /> 
                </Route>

                <Route path = '/' render = {() =>
                  <Redirect to = '/accounts/login' />
                  } /> 
                
            </Switch>
        </Router>
      </div>
    )
  }
}

const connectedComponent = connect(mapStateToProps_authComponents, mapDispatchToProps_authComponents)(AuthorizationContainer); 

export {connectedComponent as AuthorizationContainer};