import React from 'react';
import {Link} from 'react-router-dom'
import { modifyUserData } from "../redux/actions/user";  
import { connect } from "react-redux";
import "../assets/styles/loginRegister.css"


class editProfile extends React.Component {
    state = {
        username: '',
        user_id:'',
        defAddress:'',
        fullname:'',
        email:'',
        profpic:''
    }

    inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value })
    }
    
    render() {

        return <div className="base-container">
            <div className="header">User Profile</div>
            <div className="content">
                <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" name="username" onChange={this.inputHandler} placeholder="username"></input>
                        </div>
                        <div className="form-group">
                            <label htmlFor="text">Email</label>
                            <input type="text" name="text" onChange={this.inputHandler} placeholder="email"></input>                
                        </div>
                        <div className="form-group">
                            <label htmlFor="text">Default Address</label>
                            <input type="text" name="text" onChange={this.inputHandler} placeholder="default addres"></input>                
                        </div>
                <div className='detail'>
                    <label>Your default Address</label>
                    <div>{this.state.defAddress}</div>
                </div>
            </div>
            <div className="footer">
                <Link to>Modify</Link>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userGlobal: state.user,
    }
}

const mapDispatchToProps = {
    modifyUserData,
}

export default connect(mapStateToProps, mapDispatchToProps)(editProfile);