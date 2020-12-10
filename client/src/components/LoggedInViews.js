import React from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {UserProfile} from './UserProfile';
import {NavBar} from './NavBar'; 

class LoggedInViews extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="LoggedInViews">
        <Router>
            <Switch>
                <Route exact path = '/:username' render = {(props) => {
                    <UserProfile /> 
                }}>
                </Route>

                <Route path = '/' render = {() => <Redirect to= {`/${this.props.current_user}`} />}>
                </Route>

            </Switch>
        </Router>
      </div>
    )
  }
}

export {LoggedInViews}; 