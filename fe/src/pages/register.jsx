import React from "react";
import { Link } from "react-router-dom";
import Axios from 'axios';
import { registerUser  } from "../redux/actions/user";
import { API_URL } from "../constants/API";
import {connect} from "react-redux";

class Register extends React.Component {

    state = { 
        username: "",
        email: "",
        password: ""
    }

    inputHandler = (event) =>{
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]: value })
    }

    render() {
        return <div className=".base-container" ref={this.props.containerRef}>
                
                <div className="content">
                <div className="header">REGISTER</div>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" onChange={this.inputHandler} placeholder="username"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" onChange={this.inputHandler} placeholder="email"></input>                
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" onChange={this.inputHandler} placeholder="password"></input>                
                    </div>
                </div>
                </div>
                <div className="footer">
                <h6>Already have Annett's account? Login <a href="login.jsx">here</a></h6>
                    <button type="submit" onClick={()=>this.props.registerUser(this.state)} className="btn btn-success">Register Now!</button>
                </div>
            </div>
       
        
            
    }
}

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = {
    registerUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);