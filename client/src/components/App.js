import '../stylesheets/App.css';
import React from 'react';
import {SignIn} from './SignIn';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

class App extends React.Component{

  async _toyReq() {
    const data = await fetch('/toy');
    console.log(data);
    document.getElementById('toy').innerHTML = data; 
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
          </Switch>
          <Route exact path = '/'>
            <SignIn /> 
          </Route>
        </Router>
      </div>
    )
  }
}

export default App;
