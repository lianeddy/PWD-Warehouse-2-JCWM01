import Axios from "axios";
import { API_URL } from "../../constants/API";

export const getCartData = (user_id) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/cart/get?user_id=${user_id}`)
        .then((res) => {
        //   localStorage.removeItem("cartItems")
          localStorage.setItem("cartItems",JSON.stringify(res.data))
        //   console.log(res.data);
        
          dispatch({
            type: "CART_ITEMS",
            payload: res.data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
  };
};
