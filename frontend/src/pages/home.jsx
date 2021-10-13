import React from "react";

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

