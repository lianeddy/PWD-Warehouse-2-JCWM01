import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'
import LandingPage from './pages/LandingPage'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Register from "./pages/register";
import Login from "./pages/login";
import MyNavbar from "./components/MyNavbar.jsx"

class App extends React.Component {

  render(){
        return(
          <BrowserRouter>
            <MyNavbar />
            <Switch>
              <Route component={ProductDetail} path="/products/:product_id" />
              <Route component={Products} path="/products" />
              <Route component={LandingPage} path="/" />
              <Route component={Login} path="/login" />
              <Route component={Register} path="/register" />
            </Switch>
          </BrowserRouter>

        )
  }
}

export default App;