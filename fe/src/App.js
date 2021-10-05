import React from "react";
import './App.css';
import Register from "./pages/register";



class App extends React.Component {


  render () {

    return (
        <div className="App">
          <div className="login">
            <div className="container">

              <Register />

            </div>
          </div>
        </div>
      )
    };
  }

export default App;
