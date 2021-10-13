import React from 'react';
import {BrowserRouter,Route,Switch} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'

import {connect} from 'react-redux';
import {userKeepLogin,checkStorage} from './redux/actions/user';

import Register from "./pages/register";
import Login from "./pages/login";
import LandingPage from './pages/LandingPage'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import MyNavbar from './components/MyNavbar';
import Admin from './pages/Admin'

class App extends React.Component {

  componentDidMount(){
    const userLocalStorage = localStorage.getItem("userDataEmmerce")
    // console.log("userlocal",userLocalStorage)
    if (userLocalStorage){
      //karena tadi dijadiin string, jadiin object lagi
      const userData = JSON.parse(userLocalStorage)
      this.props.userKeepLogin(userData);
      // console.log("userdata app.js",userData)

    } 
    else {
      this.props.checkStorage();
    }
  }

  render(){
    if (this.props.userGlobal.storageIsChecked===true){
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
      }else{
        return(
          <div>
            Loading ...
            ini {this.props.userGlobal.storageIsChecked}
          </div>
        )
      }
  }
}

const mapStateToProps =(state)=> {
  return{
    userGlobal: state.user,
  }
};

const mapDispatchToProps = {
  userKeepLogin,
  checkStorage,
}

export default connect(mapStateToProps,mapDispatchToProps)(App);