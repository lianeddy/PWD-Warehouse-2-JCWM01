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

export const registerUser = ({fullName,username,email,password}) => {
    return (dispatch) => {
        Axios.post(`${API_URL}/users`,{
            fullName,
            username,
            email,
            password,
            role:"user",
        })
        .then((result)=> {
            delete result.data.password
            
            dispatch({
                type: "USER_LOGIN",
                payload: result.data
            })
            alert("User berhasil ditambahkan.")
        })
        .catch(()=>{
            alert("Terjadi kesalahan pada server.")
        })
}
}

export const loginUser = ({username,password}) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/users`,{
            params: {
              username,
            }
        })
        .then((result)=> {
            if (result.data.length !== 0){
                if (password===result.data[0].password){
                    delete result.data[0].password
                    //biar gak ilang terus
                    localStorage.setItem("userDataEmmerce",JSON.stringify(result.data[0]))
                    dispatch({
                        type: "USER_LOGIN",
                        payload: result.data[0]
                    })

                   } else{
                    //wrong password
                    dispatch({
                        type: "USER_ERROR",
                        payload: "Password salah, mohon masukkan kembali."
                    })
                   }

            } else {
                //wrong username
                dispatch({
                    type: "USER_ERROR",
                    payload: "Username salah, mohon masukkan kembali."
                })
            }


        })
        .catch(()=>{
            alert("Terjadi kesalahan pada server.")
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