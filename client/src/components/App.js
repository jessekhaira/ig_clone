import '../stylesheets/App.css';
import React from 'react';
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
            <Route exact path = '/getName'>
              <h3>/getName</h3>
            </Route>
          </Switch>

          <Route exact path = '/'>
            <h3>/index</h3>
          </Route>
        </Router>
        <button id = 'toy' onClick = {this._toyReq}>init</button>
      </div>
    )
  }
}

export default App;
