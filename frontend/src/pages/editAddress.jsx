import React from 'react';
import {Redirect, Link} from 'react-router-dom'
import { modifyUserAddress } from "../redux/actions/user";  
import { connect } from "react-redux";
import "../assets/styles/loginRegister.css"


class editProfile extends React.Component {
    state = {
        username: this.props.userGlobal.user_name,
        user_id: this.props.userGlobal.user_id,
        address:'',
        coordinate:'',
        fullname:'',
        email:'',
        profpic:'',
        defAddress: '',
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
        if(this.props.userGlobal.auth_status==="user" || this.props.userGlobal.auth_status==="superadmin" || this.props.userGlobal.auth_status==="admin"){
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

        return <div className="base-container">
                    <div className="content">
                        <div className="header">Add Address</div>
                            <div className="form-group">
                                    <div className="form-group">
                                        <label htmlFor="text">Address</label>
                                        <input type="text" name="address" onChange={this.inputHandler} placeholder="Address"></input>                
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="text">Location Coordinate</label>
                                        <input type="text" name="coordinate" onChange={this.inputHandler} placeholder="Coordinate"></input>                
                                    </div>
                            {/* <div className='detail'>
                                <label>Your default Address</label>
                                <div>{this.state.defAddress}</div>
                        </div> */}
                    </div>
                    <div className="footer">
                    <button onClick={()=>{this.props.modifyUserAddress(this.state) ; this.redirectHandler()}} type="submit" className="btn btn-login">Edit Now</button>
                </div>
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
    modifyUserAddress,
}

export default connect(mapStateToProps, mapDispatchToProps)(editProfile);