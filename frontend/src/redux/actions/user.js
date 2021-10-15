import Axios from 'axios';
import { API_URL } from '../../constant/API_URL';

export const confirmRegBtn = (data) => {
    return (dispatch) => {
    Axios.post(API_URL + '/register/', {
        username: data.username,
        email: data.email,
        password: data.password,
        fullname: data.fullname,
        gender: data.gender,
        age: data.age,
        auth_status: "user"
    })
        .then((res) => {
            alert("Registration successful")
            console.log(res.data)
            dispatch ({
                type: "USER_LOGIN",
                payload: res.data[0]
            });
        })
        .catch(err =>{
            alert("Registration failed")
            console.log(err)
        })
    }
}

export const loginUser = (data) => {
    return (dispatch) => {
        Axios.post(API_URL +'/login/', {
                username: data.username,
                password: data.password,
        }) 
        .then((res)=> {
            delete res.data[0].password;
            console.log(res.data[0]);

            dispatch ({
                type: "USER_LOGIN",
                payload: res.data[0]
            });
            
        })
        .catch(err =>{
            alert("Login failed")
            console.log(err)
        })
    }
}