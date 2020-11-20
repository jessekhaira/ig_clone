import '../stylesheets/App.css';
import React from 'react';
import {createStore} from 'redux';

class App extends React.Component{

  async _toyReq() {
    const data = await fetch('/toy');
    document.getElementById('toy').innerHTML = data; 
  }
  
  render() {
    return (
      <div className="App">
        <button id = 'toy' onClick = {this._toyReq}>init</button>
      </div>
    )
  }
}

export default App;
