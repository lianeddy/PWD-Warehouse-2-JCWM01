import React from "react";
import Axios from 'axios';
import { confirmRegBtn } from "../redux/actions/user";  
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Register extends React.Component {

    state = { 
        user_id: 0,
        username: "",
        email: "",
        password: "",
        fullname: "",
        gender: "",
        age: "",
        auth_status: "user"
    }

    inputHandler = (event) =>{
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]: value })
    }


    // confirmRegBtn = () => {

    //     Axios.post('http://localhost:2601/register/add-user', {
    //         username: this.state.username,
    //         email: this.state.email,
    //         password: this.state.password,
    //         fullname: this.state.fullname,
    //         gender: this.state.gender,
    //         age: this.state.age,
    //         auth_status: "user"
    //     })
    //     .then(res=> {
    //         console.log(res.data)
    //     })
    //     .catch(err =>{
    //         console.log(err)
    //     })
    // }

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
                    <div className="form-group">
                        <label htmlFor="fullname">Full Name</label>
                        <input type="text" name="fullname" onChange={this.inputHandler} placeholder="full name"></input>                
                    </div>
                    <div className="gender-group">
                        <label htmlFor="gender">Gender</label>
                        <input type="radio" name="gender" value="Male" onChange={this.inputHandler} />Male
                        <input type="radio" name="gender" value="Female" onChange={this.inputHandler} />Female            
                    </div>
                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input type="text" name="age" onChange={this.inputHandler} placeholder="age"></input>                
                    </div>
                </div>
                </div>
                <div className="footer">
                <h6>Already have Annett's account? Login <a href="login.jsx">here</a></h6>
                    <button type="submit" onClick={()=>this.props.confirmRegBtn()} className="btn btn-success">Register Now!</button>
                </div>
            </div>
       
        
            
    }
}

//export default (Register);

const mapStateToProps = (state) => ({
    user: state.register
})

const mapDispatchToProps = {
    confirmRegBtn,
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);