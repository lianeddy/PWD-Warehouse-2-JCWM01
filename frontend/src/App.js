import React from "react";
import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Register from "./pages/register";
import Login from "./pages/login";
import MyNavbar from "./components/MyNavbar.jsx"
import Home from "./pages/home";


class App extends React.Component {

  render () {

    return (
      <BrowserRouter>
      <MyNavbar/>
        <div className="App">
          <Switch>
                <Route component={Login} path="/login" />
                <Route component={Register} path="/register" />
                <Route component={Home} path="/" />
          </Switch>
        </div>
      </BrowserRouter>
      )
    };
  }

export default App;
