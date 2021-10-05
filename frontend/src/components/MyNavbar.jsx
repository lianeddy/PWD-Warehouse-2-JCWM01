import React from 'react';
import {
    Navbar,
    Nav,
    NavItem,
    NavbarText,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import Axios from 'axios'
import {API_URL} from '../constants/API'
import logo from "../assets/logo.png"

import "../../src/assets/styles/navbar.css"

import {Link} from 'react-router-dom';

class MyNavbar extends React.Component{

    state = {
        productList: [],
    }
    
    fetchproducts = () => {
    Axios.get(`${API_URL}/get-products-available`)
    .then((result) => {
        this.setState({productList: result.data})
    })
    .catch((err)=>{
        alert(err)
    })
    }

    render(){
        return(
            <div >
            <Navbar color="white" light className="navbar px-3 d-flex justify-content-between" sticky="top" >
                <Link to="/home" className="col-3" style={{textDecoration:"none",color:"inherit"}}>
                   <img src={logo} alt="home" className="navbar-logo"/>
                </Link>
                <div>
                    
                </div>
                {/* search bar */}
                <form class="form-inline my-2 my-lg-0 col-5 d-flex">
                    <input class="form-control" type="search" placeholder="Search products..." />
                    <button class="btn btn-dark ms-2" type="submit">Search</button>
                </form>
                <Nav className="navbar col-3 d-flex justify-content-between flex-direction-row">
                    <>
                        <p>Cart</p>
                        <Link to="/history"><p>History</p></Link>
                        <p>Log out</p>

                        <NavItem className="centered">
                            <NavbarText><h4>Hello, Almas!</h4></NavbarText>
                        </NavItem>
                        
                    </>
                    
                </Nav>
            </Navbar>

            </div>

        )
        
    }
}

export default MyNavbar;