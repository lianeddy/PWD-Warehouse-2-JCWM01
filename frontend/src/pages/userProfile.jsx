import React from 'react';
import {Redirect, Link} from 'react-router-dom'
import { connect } from "react-redux";
import "../assets/styles/loginRegister.css"

class UserProfile extends React.Component {
    state = {
        username: this.userGlobal.state,
        user_id: this.userGlobal.state,
        defAddress: this.userGlobal.state,
        fullname: this.userGlobal.state,
        email: this.userGlobal.state,
        profpic:''
    }

    inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value })
    }
    
    render() {

        // const { redirect } = this.state;
        // if(redirect) {
        //     return <Redirect to="/"/>
        // }

        return <div className="base-container">
            <div className="header">User Profile</div>
            <div className="content">
                <div className='detail'>
                    <label>Your Username</label>
                    <div>{this.state.username}</div>
                </div>
                <div className='detail'>
                    <label>Your Email</label>
                    <div>{this.state.email}</div>
                </div>
                <div className='detail'>
                    <label>Your default Address</label>
                    <div>{this.state.defAddress}</div>
                </div>
            </div>
            <div className="footer">
                <Link to="/editProfile">Modify</Link>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userGlobal,
    }
}

// const mapDispatchToProps = {
//     loginUser,
// }

export default connect(mapStateToProps)(UserProfile);