import React from "react";
import { Link } from "react-router-dom";

export class Login extends React.Component {
    state = {
    username: "",
    password:"",
    }


    inputHandler = (event) =>{
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]: value })
    }

    loginHandler = () => {
        alert(`username: ${this.state.username}\n password:${this.state.password}`)
    }

    render() {
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
                    <h6>Don't have Annett's account? Create <a href="/">here</a></h6> /* link*/
                    <button onClick={this.loginHandler} type="submit" className="btn btn-success">Login</button>
                </div>
            </div>
            
            
    }
}