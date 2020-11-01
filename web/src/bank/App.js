import React, { Component } from 'react';

import SignUp from './components/signup'

class App extends Component{
  render(){
    return(
        <div> 
          <h1> BLOCKCHAIN FOR KYC </h1>
          <SignUp />
        </div>
    )
  }
}

export default App;