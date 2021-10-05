import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'

import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import MyNavbar from './components/MyNavbar';

class App extends React.Component {

  render(){
        return(
          <BrowserRouter>
            <MyNavbar />
            <Switch>
              <Route component={ProductDetail} path="/product/:product_id" />
              <Route component={Home} path="/home" />
              <Route component={LandingPage} path="/" />
            </Switch>
          </BrowserRouter>

        )
  }
}

export default App;