import Axios from 'axios';
import {API_URL} from '../../constants/API'

export const getCartData = (userId) => {
    return (dispatch) => {
        Axios.get(`${API_URL}/carts`,{
            params: {
                userId,
            }
        })
        .then((result)=> {
            dispatch({
                type: "FILL_CART",
                payload: result.data
            })
        })
        .catch(()=>{
            alert("Terjadi kesalahan pada server.")
        })
}
}
