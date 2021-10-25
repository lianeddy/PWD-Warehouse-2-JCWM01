import React from 'react';
import Axios from 'react';
import { API_URL } from "../constants/API";
import {Redirect, Link} from 'react-router-dom'
import { connect } from "react-redux";
import "../assets/styles/loginRegister.css"

class UserProfile extends React.Component {
    state = {
        username: this.props.userGlobal.username,
        user_id: this.props.userGlobal.user_id,
        defAddress: "",
        address: this.props.userGlobal.address,
        fullname: this.props.userGlobal.fullname,
        email: this.props.userGlobal.email,
        profpic:this.props.userGlobal.profpic
    }

    inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value })
    }
    
    render() {

        if (this.props.userGlobal.username == null){
            return <Redirect to="/"/>
        }
        
        // const { redirect } = this.state;
        // if(redirect) {
        //     return <Redirect to="/"/>
        // }

        return <div className=".base-container">
            <div className="content">
            <div className="header">User Profile</div>
            <div class="container">
                <div class="column">
                    <div class="row">
                        <div>Your Username: {this.state.username}</div>
                    </div>
                    <div class="row">
                        <div>Your Email: {this.state.email}</div>
                    </div>
                    <div class="row">
                        <div>Your default Address: {this.state.defAddress}</div>
                    </div>
                    <div class="row">
                        <div>Your address: {this.state.address}</div>
                    </div>
                </div>
            </div>
            </div>
            <div className="footer">
                <Link to="/editAddress">Modify Address</Link>
                <Link to="/setDefAddress">Set Default Address</Link>
                <Link to="/resetPassword">Modify Password</Link>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userGlobal:state.user,
    }
}

// const mapDispatchToProps = {
//     loginUser,
// }

export default connect(mapStateToProps)(UserProfile);