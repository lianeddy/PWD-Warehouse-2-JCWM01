import Axios from 'axios';
import {API_URL} from '../../constants/API'


export const searchProduct = (searchProduct) => {
    return (dispatch) => {
        dispatch({
            type: "SEARCH_PRODUCT",
            payload: searchProduct
        })
}
}

export const confirmRegBtn = (data) => {
    return (dispatch) => {
    Axios.post('http://localhost:2700/register/add-user', {
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
        Axios.post('http://localhost:2700/login/get-user', {
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

export const logoutUser = () => {
    localStorage.removeItem("userDataEmmerce");
    return {
        type: "USER_LOGOUT"
    }
}

//ambil data dari local storage supaya login terus
export const userKeepLogin = (userData) => {
    return (dispatch) =>{
        Axios.get(`${API_URL}/users`,{
            params: {
                id: userData.id
            }
        })
        .then((result) => {
            delete result.data[0].password
            localStorage.setItem("userDataEmmerce",JSON.stringify(result.data[0]))
            dispatch({
                type: "USER_LOGIN",
                payload: result.data[0]
            })
        })
        .catch(()=>{
            alert("Terjadi kesalahan pada server.")
        })
    }
}

export const checkStorage = () => {
    return {
        type: "CHECK_STORAGE"
    }
}