import React from 'react';
import Axios from 'axios';
import { API_URL } from "../constants/API";
import { Redirect, Link } from 'react-router-dom'
import { connect } from "react-redux";
import { getAlbum } from '../redux/actions/user'
import "../assets/styles/loginRegister.css"
import Card from '../components/card'

class UserProfile extends React.Component {
    state = {
        user_id: this.props.userGlobal.user_id,
        username: this.props.userGlobal.username,
        user_id: this.props.userGlobal.user_id,
        defAddress: [],
        address: [],
        fullname: this.props.userGlobal.fullname,
        email: this.props.userGlobal.email,
        profpic:this.props.userGlobal.profpic,
        dataAlbum: [],
        redirect: false,
        redirectNonUser: false,
    }

    componentDidMount() {
        if(this.props.userGlobal.auth_status==="user" || this.props.userGlobal.auth_status==="admin"){
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
           console.log(this.state.address)
        })
        .catch((err) => {
            alert(err);
        });
    }

    getDefaultAddress = () => {
        Axios.get(API_URL + `/keeplogin/defAddress?user_id=${this.props.userGlobal.user_id}`)
        .then((res) => {
           this.setState({defAddress:res.data[0]})
           console.log(this.state.defAddress)
        })
        .catch((err) => {
            alert(err);
        });
    }

    getDataAlbum = () => {
        Axios.get(API_URL + '/upload/getAlbum')
            .then((res) => {
                this.setState({ dataAlbum: res.data })
            })
            .catch((err) => {
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

    printCard = () => {
        let { dataAlbum } = this.state
        return dataAlbum.map((item, index) => {
            return <Card title={item.pic_title} image={API_URL + item.profpic} />
        })
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
                                <div className="form-group">
                                    <label htmlFor="img">Image</label>
                                    <input type="file" className="form-control" id="img" aria-describedby="emailHelp" onChange={this.onBtAddFile} ref={elemen => this.inputImage = elemen} />
                                </div>
                            </form>
                            <button type="button" className="btn btn-primary float-right" onClick={this.onBtAdd}>Add Data</button>
                </div>
                <div class="col-md-3 p-4 bg-light text-white text-left">
                    <div class="row">
                    {this.printCard()}
                    </div>
                    <div class="row">
                        <div readonly className="form-control-plaintext">Your Username: {this.state.username}</div>
                    </div>
                    <div class="row">
                        <div readonly className="form-control-plaintext">Your Email: {this.state.email}</div>
                    </div>
                    <div class="row">
                        <div readonly className="form-control-plaintext">Your default Address: {this.state.address.user_address}</div>
                    </div>
                    <div class="row">
                        <div readonly className="form-control-plaintext">Your address: {this.state.defAddress.user_address}</div>
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
    console.log('check', state.albumReducer.dataAlbum)
    return {
        userGlobal:state.user,
        dataAlbum: state.albumReducer.dataAlbum
    }
}

export default connect(mapStateToProps, { getAlbum })(UserProfile);