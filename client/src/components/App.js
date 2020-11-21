import '../stylesheets/App.css';
import React from 'react';
import {SignIn} from './SignIn';
import {Register} from './Register';
import {Footer} from './Footer';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

/**
 * This class represents a React Component that acts as the main wrapper for the components
 * for this application. In addition, this component is responsible for routing with react-router.
 * 
 * @class @public 
 */
class App extends React.Component{

  render() {
    return (
      <div className="App">
        <Router>
          
          <Switch>
            <Route exact path = '/'>
              <SignIn /> 
            </Route>

            <Route exact path = '/register'>
              <Register /> 
            </Route>
          </Switch>

          <Route>
            <Footer /> 
          </Route>

        </Router>
      </div>
    )
  }
}

export default App;
