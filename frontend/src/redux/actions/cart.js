// import Axios from "axios";
// import { API_URL } from "../../constants/API";

// export const getCartID = (user_id) => {
//   return (dispatch) => {
//     Axios.get(`${API_URL}/cart/id?user_id=${user_id}`)
//         .then((res) => {
//           localStorage.setItem("cartData",JSON.stringify(res.data[0]))
//           // console.log(res.data[0]);
  
//           dispatch({
//             type: "CART_ID",
//             payload: res.data[0],
//           });
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//   };
// };

// export const removeCartID = (user_id) => {
//     localStorage.removeItem("cartData");
//     return {
//       type: "USER_LOGOUT",
//     };
//   };