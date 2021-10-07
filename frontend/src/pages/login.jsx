import React from "react";
import Axios from 'axios'
import { loginUser } from "../redux/actions/user";  
import { Link } from "react-router-dom";
import { connect } from "react-redux";


class Login extends React.Component {
    state = {
    username: "",
    password:"",
    }


    inputHandler = (event) =>{
        const value = event.target.value;
        const name = event.target.name;

        this.setState({ [name]: value })
    }

    loginUser = ({ username, password }) => {
        
            Axios.get('http://localhost:2601/login', {
                params: {
                    username: username,
                    password: password,
                }
            }) 
            .then((res)=> {
                alert("Login successful");
                console.log(res.data);
            })
            .catch(err =>{
                alert("Login failed")
                console.log(err)
            })
        
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
                    <h6>Don't have Annett's account? Create <a href="/">here</a></h6>
                    <button onClick={()=>this.loginUser(this.state)} type="submit" className="btn btn-success">Login</button>
                </div>
            </div>
            
            
    }
}

// const mapStateToProps = (state) => ({
//     user: state.login
// })

// const mapDispatchToProps = {
//     loginUser,
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Login);

export default Login;