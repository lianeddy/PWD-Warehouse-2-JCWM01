import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'

import LandingPage from './pages/LandingPage'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import MyNavbar from './components/MyNavbar';

class App extends React.Component {

  render(){
        return(
          <BrowserRouter>
            <MyNavbar />
            <Switch>
              <Route component={ProductDetail} path="/products/:product_id" />
              <Route component={Products} path="/products" />
              <Route component={LandingPage} path="/" />
            </Switch>
          </BrowserRouter>

        )
  }
}

export default App;