import React from 'react';
import {Redirect, Link} from 'react-router-dom'
import { connect } from "react-redux";
import "../assets/styles/loginRegister.css"

class UserProfile extends React.Component {
    state = {
        username: this.props.userGlobal.username,
        user_id: this.props.userGlobal.user_id,
        defAddress: this.props.userGlobal.defAddress,
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

        return <div className="base-container">
            <div className="header">User Profile</div>
            <div className="content">
            <div className='detail'>
                    <label>Your User ID</label>
                    <div>{this.state.user_id}</div>
                </div>
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
                <Link to="/editAddress">Modify Address</Link>
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