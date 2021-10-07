import React from 'react';
import Axios from 'axios';


export const confirmRegBtn = () => {
    return (dispatch) => {
    Axios.post('http://localhost:2601/register/add-user', {
        username: this.props.state.username,
        email: this.props.state.email,
        password: this.props.state.password,
        fullname: this.props.state.fullname,
        gender: this.props.state.gender,
        age: this.props.state.age,
        auth_status: "user"
    })
        .then(res=> {
            alert("Registration successful")
            console.log(res.data)
        })
        .catch(err =>{
            alert("Registration failed")
            console.log(err)
        })
    }
}


export const loginUser = ({ username, password }) => {
    return (dispatch) => {
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
}