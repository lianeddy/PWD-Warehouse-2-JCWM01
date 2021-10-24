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
import VerificationPage from './pages/verification';

class App extends React.Component {
  
  componentDidMount(){
    const userLocalStorage = localStorage.getItem("userDataEmmerce")
    if (userLocalStorage){
      //karena tadi dijadiin string, jadiin object lagi
      const userData = JSON.parse(userLocalStorage)
      this.props.userKeepLogin(userData);
      console.log(userData.username)

    } else {
      this.props.checkStorage();
    }
  }

  render(){
    if (this.props.userGlobal.storageIsChecked){
        return(
          <BrowserRouter>
            <MyNavbar />
            <Switch>
              {
                this.props.userGlobal.auth_status==="admin"||this.props.userGlobal.auth_status==="superadmin"?
                <Route component={Admin} path="/admin" />
                :
                null
              }
              <Route component={Login} path="/login" />
              <Route component={Register} path="/register" />
              <Route component={ProductDetail} path="/products/:product_id" />
              <Route component={Products} path="/products" />
              <Route component={VerificationPage} path="/auth/:token" />
              <Route component={LandingPage} path="/" />
            
            </Switch>
          </BrowserRouter>

        )
    }else{
      return(
        <div>
          Loading ...
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
