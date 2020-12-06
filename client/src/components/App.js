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
  constructor(props) {
    super(props);
    console.log(a3); 
  }

  displayErrorInHTMLElement(err_msg, err_node, display) {
    if (err_msg.includes(":")) {
        err_msg = err_msg.split(":")[1]; 
    }
    err_node.innerHTML = err_msg; 
    err_node.style.display = display; 
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
          
          <Switch>
            <Route exact path = '/'>
              <SignIn 
              displayErrorInHTMLElement = {this.displayErrorInHTMLElement}
              _animate_input_labels = {this._animate_input_labels}
              /> 
            </Route>

            <Route exact path = '/register'>
              <Register 
              displayErrorInHTMLElement = {this.displayErrorInHTMLElement}
              _animate_input_labels = {this._animate_input_labels}/> 
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
