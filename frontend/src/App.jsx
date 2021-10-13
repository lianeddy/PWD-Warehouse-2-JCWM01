import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'

import {connect} from 'react-redux';

import Register from "./pages/register";
import Login from "./pages/login";
import LandingPage from './pages/LandingPage'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import MyNavbar from './components/MyNavbar';
import Admin from './pages/Admin'

class App extends React.Component {

  render(){
    return(
      <BrowserRouter>
        <MyNavbar />
        <Switch>
          <Route component={Login} path="/login" />
          <Route component={Register} path="/register" />
          <Route component={ProductDetail} path="/products/:product_id" />
          <Route component={Products} path="/products" />
          <Route component={Admin} path="/admin" />
          <Route component={LandingPage} path="/" />
        
        </Switch>
      </BrowserRouter>
    )

  }
}


export default App;