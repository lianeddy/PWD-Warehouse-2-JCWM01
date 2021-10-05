import Axios from 'axios';
import { API_URL } from "../../constants/API";

export const registerUser = ({ username, email, password }) => {
    return (dispatch) => {

    Axios.post(`${API_URL}/users`, {
        username,
        email,
        password,
        role: "user",
         })
        .then((result) =>{
            delete result.data.password;
            console.log(result.data)
            dispatch({
                type: "USER_LOGIN",
                payload: result.data
            })
            alert("Register account success")
        })
        .catch(() =>{
            alert("Register failed, please contact the administrator")
        })
    }
}