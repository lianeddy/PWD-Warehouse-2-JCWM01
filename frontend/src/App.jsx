import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

import { connect } from "react-redux";
import { userKeepLogin, checkStorage, getCartID } from "./redux/actions/user";
import { getCartData } from "./redux/actions/cart";

import Register from "./pages/register";
import Login from "./pages/login";
import LandingPage from "./pages/LandingPage";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import MyNavbar from "./components/MyNavbar";
import Admin from "./pages/Admin";
import userProfile from "./pages/userProfile";
import editAddress from "./pages/editAddress";
import VerificationPage from "./pages/verification";
import resetPass from "./pages/resetPass";
import setDefAddress from "./pages/setDefAddress";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Sales from "./pages/SalesReport";

class App extends React.Component {
  componentDidMount() {
    const userLocalStorage = localStorage.getItem("userDataEmmerce");
    const userData = JSON.parse(userLocalStorage);

    if (userData) {
      this.props.userKeepLogin(userData);
      this.props.getCartData(userData.user_id);
      console.log(userData.username);

      if (userData.auth_status === "user") {
        this.props.getCartID(userData);
      }
    } else {
      this.props.checkStorage();
    }
  }

  render() {
    if (this.props.userGlobal.storageIsChecked) {
      return (
        <BrowserRouter>
          <MyNavbar />
          <Switch>
            {this.props.userGlobal.auth_status === "admin" ||
            this.props.userGlobal.auth_status === "superadmin" ? (
              <Route component={Admin} path="/admin" />
            ) : null}
            <Route component={Login} path="/login" />
            <Route component={Register} path="/register" />
            <Route component={ProductDetail} path="/products/:product_id" />
            <Route component={Products} path="/products" />
            <Route component={userProfile} path="/profile" />
            <Route component={editAddress} path="/editAddress" />
            <Route component={setDefAddress} path="/setDefAddress" />
            <Route component={resetPass} path="/resetPassword" />
            <Route component={VerificationPage} path="/auth/:token" />
            <Route component={Cart} path="/cart" />
            <Route component={Payment} path="/payment" />
            <Route component={Sales} path="/sales" />
            <Route component={LandingPage} path="/" />
          </Switch>
        </BrowserRouter>
      );
    } else {
      return <div>Loading ...</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    userGlobal: state.user,
    cartGlobal: state.cart,
  };
};

const mapDispatchToProps = {
  userKeepLogin,
  checkStorage,
  getCartID,
  getCartData,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
