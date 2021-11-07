import React from 'react';
import Axios from 'axios';
import {Redirect} from 'react-router-dom'
import { API_URL } from "../constants/API";
import { setDefaultAddress } from "../redux/actions/user";  
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
            this.getAddress()
        } else {
            this.setState({redirectNonUser: true})
        }
    }

    getAddress = () => {
        Axios.get(API_URL + `/keeplogin/address?user_id=${this.props.userGlobal.user_id}`)
        .then((res) => {
           this.setState({address:res.data})
        })
        .catch((err) => {
            alert(err);
        });
    }

    renderAddress = () => {
        if(this.state.address){
            return this.state.address.map((val) => {
                return(
                    <tr>
                        <td>{val.user_address}</td>
                        <td>{val.user_location}</td>
                        <td>
                        <button onClick={()=>{this.props.setDefaultAddress(val) ; this.redirectHandler()}} type="submit" className="btn btn-login">Set as Default</button>
                        </td>
                    </tr>
                    )
            })
        }
    }

    render() {
        const { redirectNonUser } = this.state;
        if(redirectNonUser) {
            return <Redirect to="/"/>
        }

        const { redirect } = this.state;
        if(redirect) {
            return <Redirect to="/profile"/>
        }

        return <div className="base-container">
                    <div className="content">
                        <div className="header">Set Default Address</div>
                        <table className="table">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col">Address</th>
                                    <th scope="col">Geolocation</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderAddress()}
                            </tbody>
                        </table>
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
    setDefaultAddress,
}

export default connect(mapStateToProps, mapDispatchToProps)(editProfile);