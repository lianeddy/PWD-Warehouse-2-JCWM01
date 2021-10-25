import React from 'react';
import Axios from 'axios';
import { API_URL } from "../constants/API";
import {Redirect, Link} from 'react-router-dom'
import { connect } from "react-redux";
import "../assets/styles/loginRegister.css"

class UserProfile extends React.Component {
    state = {
        user_id: this.props.userGlobal.user_id,
        username: this.props.userGlobal.username,
        user_id: this.props.userGlobal.user_id,
        defAddress: this.props.userGlobal.defAddress,
        address: [],
        fullname: this.props.userGlobal.fullname,
        email: this.props.userGlobal.email,
        profpic:this.props.userGlobal.profpic,
        datAlbum: [],
    }

    componentDidMount() {
        this.getDataAlbum() 
    }

    getDataAlbum = () => {
        Axios.get(API_URL + '/album/get')
            .then(res => {
                this.setState({ datAlbum: res.data })
            })
            .catch(err => {
                console.log(err)
            })
    }

    inputHandler = (event) => {
        const value = event.target.value;
        const name = event.target.name;
        this.setState({ [name]: value })
    }

    onBtAdd = () => {
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
                    this.getDataAlbum()
                    alert(res.data.message)
                })
                .catch(err => {
                    console.log(err)
                });
        }
    }

    onBtAddFile = (e) => {
        if (e.target.files[0]) {
            this.setState({ addFileName: e.target.files[0].name, addFile: e.target.files[0] })
            let preview = document.getElementById("imgpreview")
            preview.src = URL.createObjectURL(e.target.files[0])
        }
    }
    
    render() {

        if (this.props.userGlobal.username == null){
            return <Redirect to="/"/>
        }
        
        // const { redirect } = this.state;
        // if(redirect) {
        //     return <Redirect to="/"/>
        // }

        return <div className=".base-container">
            <div className="content">
            <div className="header">User Profile</div>
            <div class="container">
            <div className="d-flex justify-content-center">
                <div className="col-md-3 p-4 bg-dark text-white text-left">
                    <di className="col-md-3">
                        <img id="imgpreview" width="100%" />
                    </di>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" className="form-control" id="title"  aria-describedby="emailHelp" ref={elemen => this.inputTitle = elemen} />
                                </div>
                                <img src={API_URL + '/public/images/IMG1635143785016.jpg'} className="admin-product-image" alt={val.productName}/>
                                <div className="form-group">
                                    <label htmlFor="img">Image</label>
                                    <input type="file" className="form-control" id="img" aria-describedby="emailHelp" onChange={this.onBtAddFile} ref={elemen => this.inputImage = elemen} />
                                </div>
                            </form>
                            <button type="button" className="btn btn-primary float-right" onClick={this.onBtAdd}>Add Data</button>
                </div>
                <div class="col-md-3 p-4 bg-light text-white text-left">
                    <div class="row">
                        <div readonly className="form-control-plaintext">Your Username: {this.state.username}</div>
                    </div>
                    <div class="row">
                        <div readonly className="form-control-plaintext">Your Email: {this.state.email}</div>
                    </div>
                    <div class="row">
                        <div readonly className="form-control-plaintext">Your default Address: {this.state.defAddress}</div>
                    </div>
                    <div class="row">
                        <div readonly className="form-control-plaintext">Your address: {this.state.address}</div>
                    </div>
                </div>
            </div>
            </div>
            </div>
            <div className="footer">
                <Link to="/editAddress">Modify Address</Link>
                <Link to="/setDefAddress">Set Default Address</Link>
                <Link to="/resetPassword">Modify Password</Link>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {
        userGlobal:state.user,
    }
}

// const mapDispatchToProps = {
//     loginUser,
// }

export default connect(mapStateToProps)(UserProfile);