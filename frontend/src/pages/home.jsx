import React from "react";
import "../assets/styles/loginRegisterStyle.css";

class Home extends React.Component {
    state = {
    loginStatus:"",
    }

    render() {
        return <div className=".base-container">
        <h1>
            Home Page
        </h1>
        <div>{this.state.loginStatus}</div>
        </div>
    }
}


export default Home;

