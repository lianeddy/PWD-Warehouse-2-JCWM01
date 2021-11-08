import React from 'react';
import Axios from 'axios';
import { API_URL } from "../constants/API";
import { Redirect, Link } from 'react-router-dom'
import { connect } from "react-redux";
import "../assets/styles/userProfile.css"


class UserProfile extends React.Component {
    state = {
        user_id: this.props.userGlobal.user_id,
        username: this.props.userGlobal.username,
        user_id: this.props.userGlobal.user_id,
        defAddress: [],
        address: [],
        fullname: this.props.userGlobal.fullname,
        email: this.props.userGlobal.email,
        pic_location:this.props.userGlobal.pic_location,
        redirect: false,
        redirectNonUser: false,
        auth_status: this.props.userGlobal.auth_status
    }

    refreshPage = ()=>{
        window.location.reload();
      }

    componentDidMount() {
        if(this.props.userGlobal.auth_status==="user" || this.props.userGlobal.auth_status==="superadmin" || this.props.userGlobal.auth_status==="admin"){
            console.log("authorized")
        } else {
            this.setState({redirectNonUser: true})
        }
        this.getAddress() 
        this.getDefaultAddress() 
    }

    getAddress = () => {
        Axios.get(API_URL + `/keeplogin/address?user_id=${this.props.userGlobal.user_id}`)
        .then((res) => {
           this.setState({address:res.data[0]})
        })
        .catch((err) => {
            alert(err);
        });
    }

    getDefaultAddress = () => {
        Axios.get(API_URL + `/keeplogin/defAddress?user_id=${this.props.userGlobal.user_id}`)
        .then((res) => {
           this.setState({defAddress:res.data[0]})
        })
        .catch((err) => {
            alert(err);
        });
    }

    inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value })
    }

    uploadHandler = () => {
        if (this.state.addFile) {
            let formData = new FormData()

            let obj = {
                title: this.inputTitle.value,
                user_id: this.state.user_id,
            }

            formData.append('data', JSON.stringify(obj));
            formData.append('file', this.state.addFile);
            Axios.post(`${API_URL}/upload/add-profile-picture`,formData)
                .then(res => {
                    this.refreshPage()
                    alert(res.data.message)
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }

    previewHandler = (e) => {
        if (e.target.files[0]) {
            this.setState({ addFileName: e.target.files[0].name, addFile: e.target.files[0] })
            let preview = document.getElementById("imgpreview")
            preview.src = URL.createObjectURL(e.target.files[0])
        }
    }
    
    renderHistoryButton = () => {
        if(this.state.auth_status==='admin'){
            return(
            <Link to="/" style={{ textDecoration: 'none' }}>
                <button className="btn-dark">Back Home</button>
            </Link>
            )
        } else {
            return(
            <Link to="/history" style={{ textDecoration: 'none' }}>
                 <button className="btn-dark">Check your transactions</button>
            </Link>
            )  
        }
    }

    render() {
        console.log(this.state.address)
        const { redirectNonUser } = this.state;
        if(redirectNonUser) {
            return <Redirect to="/"/>
        }

        const { redirect } = this.state;
        if(redirect) {
            return <Redirect to="/"/>
        }

        return <div className=".base-container">
            <div className="content">
                <div className="header">User Profile</div>
                    <div className="container">
                    <div className="d-flex justify-content-center">
                        <div className="col-md-3 p-4 bg-dark text-white text-left">
                            <div className="col-md-3">
                                <img id="imgpreview" width="100%" />
                            </div>
                                <form>
                                    <div className="form-group">
                                        <label htmlFor="title">Title</label>
                                        <input type="text" className="form-control" id="title"  aria-describedby="emailHelp" ref={elemen => this.inputTitle = elemen} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="img">Image</label>
                                        <input type="file" className="form-control" id="img" aria-describedby="emailHelp" onChange={this.previewHandler} ref={elemen => this.inputImage = elemen} />
                                    </div>
                                </form>
                                <button type="button" className="btn btn-primary float-right" onClick={this.uploadHandler}>Add Data</button>
                        </div>
                        <div className="col-md-3 p-4 bg-light text-white text-left">
                        <div className="row">
                        <img src={API_URL + this.state.pic_location}  alt="user-profile-picture" />
                        </div>
                        <div className="row">
                            <div readOnly className="form-control-plaintext">Your Username: {this.state.username}</div>
                        </div>
                        <div className="row">
                            <div readOnly className="form-control-plaintext">Your Email: {this.state.email}</div>
                        </div>
                        <div className="row">
                            <div readOnly className="form-control-plaintext">Your default Address: {this.state.defAddress ? this.state.defAddress.user_address : null}</div>
                        </div>
                        <div className="row">
                            <div readOnly className="form-control-plaintext">Your address: {this.state.address ? this.state.address.user_address : null}</div>
                        </div>
                    </div>
                </div>
                
                </div>
                
            </div>
                <div className="d-flex justify-content-center footer-tab">
                    <Link to="/editAddress" style={{ textDecoration: 'none' }}>
                    <button className="btn-userTab" style={{ textDecoration: 'none' }}>Add Address</button>
                    </Link>
                    <Link to="/setDefAddress" style={{ textDecoration: 'none' }}>
                    <button className="btn-userTab">Set Default Address</button>
                    </Link>
                    <Link to="/resetPassword" style={{ textDecoration: 'none' }}>
                    <button className="btn-userTab">Modify Password</button>
                    </Link>
                </div>
        </div>
        
    }
}

const mapStateToProps = (state) => {
    return {
        userGlobal:state.user,
    }
}

export default connect(mapStateToProps)(UserProfile);