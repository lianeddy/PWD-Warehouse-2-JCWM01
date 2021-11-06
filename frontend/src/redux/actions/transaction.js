import Axios from "axios";
import { API_URL } from "../../constants/API";

export const getCurrentTransactionData = (user_id) => {
    return (dispatch) => {
      Axios.get(`${API_URL}/transaction/get?user_id=${user_id}`)
          .then((res) => {
            localStorage.setItem("currentTransaction",JSON.stringify(res.data))
            console.log(res.data);
          
            dispatch({
              type: "TRANSACTION",
              payload: res.data,
            });
          })
          .catch((err) => {
            console.log(err);
          });
    };
  };