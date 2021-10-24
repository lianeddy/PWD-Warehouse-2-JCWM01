import React from "react";
import { resetPass } from "../redux/actions/user";  
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import "../assets/styles/loginRegister.css"


class ResetPass extends React.Component {
    state = {
    user_id:this.props.userGlobal.user_id,
    password:"",
    confirmPassword:"",
    state:"email",
    redirect: false,
    redirectNonUser: false,
    } 

    redirectHandler = () => {
        this.setState({redirect: true})
    }

    inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value })
    }

    componentDidMount() {
        if(this.props.userGlobal.auth_status==="user"){
            console.log("authorized")
        } else {
            this.setState({redirectNonUser: true})
        }
    }

    render() {
        const { redirectNonUser } = this.state;
        if(redirectNonUser) {
            return <Redirect to="/"/>
        }
        
        const { redirect } = this.state;
        if(redirect) {
            return <Redirect to="/"/>
        }
        
        return <div className=".base-container" ref={this.props.containerRef}>
                
                <div className="content">
                <div className="header">Reset Password</div>
                <div className="form">

                    <div className="form-group">
                        <label htmlFor="email">Please input your registered email address</label>
                        <input type="text" name="email" onChange={this.inputHandler} placeholder="email"></input>                
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">New Password</label>
                        <input id="password" type="password" name="password" onChange={this.inputHandler} placeholder="username"></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Please type your password one more time</label>
                        <input id="confirmPassword" type="password" name="confirmPassword" onChange={this.inputHandler} placeholder="password"></input>                
                    </div>
                </div>
                </div>
                <div className="footer">
                    <button type="submit" onClick={()=>{this.props.resetPass(this.state) ; this.redirectHandler()}} className="btn btn-login">Confirm Reset Password
                    </button>
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
   resetPass,
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPass);

