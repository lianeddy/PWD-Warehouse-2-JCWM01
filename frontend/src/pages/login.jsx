import React from "react";
import { loginUser } from "../redux/actions/user";  
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import "../assets/styles/style.css";

class Login extends React.Component {
    state = {
    username: "",
    password:"",
    redirect: false
    }

    redirectHandler = () => {
        this.setState({redirect: true})
    }

    inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value })
    }

    render() {
        if (this.props.userGlobal.username){
            return <Redirect to="/"/>
        }

        const { redirect } = this.state;
        if(redirect) {
            return <Redirect to="/"/>
        }
        
        return <div className=".base-container" ref={this.props.containerRef}>
                
                <div className="content">
                <div className="header">LOGIN</div>
                <div className="form">
                    
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" onChange={this.inputHandler} placeholder="username"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" onChange={this.inputHandler} placeholder="password"></input>                
                    </div>
                </div>
                </div>
                <div className="footer">
                    <h6>Don't have Annett's account? Create <Link to="/register">here</Link></h6>
                    <button onClick={()=>{this.props.loginUser(this.state) ; this.redirectHandler()}} type="submit" className="btn btn-login">Login</button>
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
    loginUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);

