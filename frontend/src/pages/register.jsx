import React from "react";
import { confirmRegBtn } from "../redux/actions/user";  
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import "../assets/styles/loginRegister.css"


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

    redirectHandler = () => {
        this.setState({redirect: true})
    }

    inputHandler = (event) =>{
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value })
    }

    render() {
        const { redirect } = this.state;
        if(redirect) {
            return <Redirect to="/"/>
        }

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

                    <label htmlFor="gender">Gender</label>
                    <div className="gender-group">
                        <span className="radiocontainer">
                        <label htmlFor="genderMale" className="radiolabel">Male</label>
                        <input className="selector" name="gender" type="radio" value="Male" onChange={this.inputHandler} />
                        <label htmlFor="genderFemale" className="radiolabelfem">Female</label>
                        <input className="selector" name="gender" type="radio" value="Female" onChange={this.inputHandler} />   
                        </span>
                    </div>

                    <div className="form-group">
                        <label htmlFor="age">Age</label>
                        <input type="text" name="age" onChange={this.inputHandler} placeholder="age"></input>                
                    </div>

                </div>
                </div>
                <div className="footer">
                <h6>Already have Annett's account? Login <Link to="/login">here</Link></h6>
                    <button type="submit" onClick={()=>{this.props.confirmRegBtn(this.state); this.redirectHandler()}} className="btn btn-login">Register Now!</button>
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
    confirmRegBtn,
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);