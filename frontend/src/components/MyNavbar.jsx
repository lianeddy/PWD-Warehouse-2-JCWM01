import React from 'react';
import {
    Navbar,
    Nav,
    DropdownToggle,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import logo from "../assets/logo.png"
import { IoMdBasket,IoMdTime } from "react-icons/io"

import "../assets/styles/navbar.css"

import {Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { searchProduct,logoutUser } from '../redux/actions/user';


class MyNavbar extends React.Component{
    state = {
        searchProduct:"",
    }

    inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;
  
        this.setState({[name] : value})
    }

    searchProductHandler = () => {
        console.log("search clicked", this.state.searchProduct)
        this.props.searchProduct(this.state)
    }

    render(){
        return(

            <Navbar color="white" light className="navbar px-3 d-flex justify-content-between" fixed="top" >
                <Link to="/" className="col-4 link">
                   <img src={logo} alt="home" className="navbar-logo"/>
                </Link>
                <div>
                    
                </div>
                {/* search bar */}
                {
                    this.props.userGlobal.auth_status === "admin" ?
                    null
                    :
                    this.props.userGlobal.auth_status === "superadmin" ?
                    null
                    :
                    <form className="form-inline my-2 my-lg-0 col-4 d-flex align-items-center">
                        <input className="form-control" name="searchProduct"  onChange={this.inputHandler} type="search" placeholder="Search products..." />

                        <Link  to="/products" >
                            <button onClick={this.searchProductHandler} className="btn btn-dark ms-2" type="submit"><p>Search</p></button>
                        </Link> 

                    </form>
                }

                <Nav className="navbar col-4 d-flex justify-content-between align-items-center flex-direction-row ">
                    <>
                    <div className="col-6 d-flex justify-content-end flex-direction-row middle-nav">
                        {
                            this.props.userGlobal.auth_status === "user" ?
                            <>
                                <div className="mx-2 d-flex justify-content-between align-items-center flex-direction-row">
                                    <IoMdBasket className="icon" /> 
                                    <Link to="/cart" className="link">Cart</Link>
                                </div>
                                <div className="mx-2 d-flex justify-content-between align-items-center flex-direction-row">
                                    <IoMdTime className="icon" />
                                    <Link to="/history" className="link">History</Link>
                                </div>
                            </>
                            :null
                        }
                        
                        <div className="mx-2 d-flex justify-content-between align-items-center flex-direction-row">
                            {
                                this.props.userGlobal.username ?
                                <Link to="/">
                                    <button onClick={this.props.logoutUser} className="button">Log out</button>
                                </Link>
                                :
                                <div className="d-flex justify-content-between align-items-center flex-direction-row">
                                    <Link to="/login">
                                        <button className="button">Log in</button>
                                    </Link>
                                    <Link to="/register">
                                        <button className="button">Register</button>
                                    </Link>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-5">

                        {
                            this.props.userGlobal.username ?
                            <UncontrolledDropdown className="centered dropdown">
                                <DropdownToggle>
                                    <h4>Hello, {this.props.userGlobal.username}!</h4>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem><Link to="/userProfile" className="button-link" ><h4>Profile</h4></Link></DropdownItem>
                                    {
                                        this.props.userGlobal.auth_status === "superadmin" ?
                                        <>
                                            <DropdownItem><Link to="/admin" className="button-link" ><h4>Admin</h4></Link></DropdownItem>
                                            <DropdownItem><Link to="/superadmin" className="button-link" ><h4>Super Admin</h4></Link></DropdownItem>
                                        </>
                                        :
                                        this.props.userGlobal.auth_status === "admin" ?
                                        <DropdownItem><Link to="/admin" className="button-link" ><h4>Admin</h4></Link></DropdownItem>
                                        :
                                        null
                                    }
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            :
                            null
                        }


                    </div>
                        
                    </>
                    
                </Nav>
            </Navbar>
            

        )
        
    }
}

const mapStateToProps =(state)=> {
    return{
        userGlobal: state.user,
    }
};

const mapDispatchToProps = {
    searchProduct, 
    logoutUser
}

export default connect(mapStateToProps,mapDispatchToProps)(MyNavbar);
