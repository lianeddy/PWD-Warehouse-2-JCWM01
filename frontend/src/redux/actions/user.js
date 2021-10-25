import Axios from "axios";
import { API_URL } from "../../constants/API";

export const searchProduct = (searchProduct) => {
  return (dispatch) => {
    dispatch({
      type: "SEARCH_PRODUCT",
      payload: searchProduct,
    });
  };
};

export const confirmRegBtn = (data) => {
  return (dispatch) => {
    Axios.post(API_URL + "/register/", {
      username: data.username,
      email: data.email,
      password: data.password,
      fullname: data.fullname,
      gender: data.gender,
      age: data.age,
      auth_status: "user",
    })
      .then((res) => {
        alert("Registration successful");
        console.log(res.data);
        dispatch({
          type: "USER_LOGIN",
          payload: res.data[0],
        });
      })
      .catch((err) => {
        alert("Registration failed");
        console.log(err);
      });
  };
};

export const getAlbum = (data) => {
  console.log('action',data)
  return {
      type: 'GET_ALBUM',
      payload: data
  }
};

export const loginUser = (data) => {
  return (dispatch) => {
    Axios.post(API_URL + "/login/", {
      username: data.username,
      password: data.password,
    })
      .then((res) => {
        console.log(`res datalogin is ${res.data.dataLogin}`);
        delete res.data.dataLogin.password;
        localStorage.setItem("userDataEmmerce", JSON.stringify(res.data.token));
        console.log(res.data.dataLogin);

        dispatch({
          type: "USER_LOGIN",
          payload: res.data.dataLogin,
        });
      })
      .catch((err) => {
        alert("Login failed");
        console.log(err);
      });
  };
};

export const modifyUserAddress = (data) => {
  return (dispatch) => {
    console.log(`Delivering changes to ${data.user_id}`);
    Axios.post(API_URL + "/editAddress/add", {
      user_id: data.user_id,
      username: data.username,
      email: data.email,
      user_location: data.coordinate,
      address: data.address,
      default_address: 0,
    })
      .then((res) => {
        alert("User Profile updated");
        console.log(res.data.data);

        dispatch({
          type: "USER_LOGIN",
          payload: res.data.data.address,
        });
      })
      .catch((err) => {
        alert("User profile update failed");
        console.log(err);
      });
  };
};

export const setDefaultAddress = (data) => {
  return (dispatch) => {
    Axios.post(API_URL + `/setDefault/`, {
      user_id: data.user_id,
      address: data.address,
    })
      .then((res) => {
        alert("User Profile updated");
        console.log(res.data);

        dispatch({
          type: "USER_LOGIN",
          payload: res.data,
        });
      })
      .catch((err) => {
        alert("User profile update failed");
        console.log(err);
      });
  };
};

export const logoutUser = () => {
  localStorage.removeItem("userDataEmmerce");
  // localStorage.removeItem("cartData");
  return {
    type: "USER_LOGOUT",
  };
};

//ambil data dari local storage supaya login terus, nitip dulu ya soalnya kerefresh terus pas coba upload data
export const userKeepLogin = (data) => {
  return (dispatch) => {
    Axios.get(API_URL + `/keeplogin?username=${data.username}`)
      .then((res) => {
        delete res.data[0].password;
        localStorage.setItem("userDataEmmerce", JSON.stringify(res.data[0]));

        dispatch({
          type: "USER_LOGIN",
          payload: res.data[0],
        });
      })
      .catch((err) => {
        alert(err);
      });
  };
};

export const getAddress = (data) => {
  return (dispatch) => {
    Axios.get(API_URL + `/getAddress?username=${data.username}`)
      .then((res) => {
        delete res.data[0].password;

        dispatch({
          type: "USER_LOGIN",
          payload: res.data[0],
        });
      })
      .catch((err) => {
        alert(err);
      });
  };
};

export const getCartID = (data) => {
  return (dispatch) => {
    Axios.get(`${API_URL}/cart/id?user_id=${data.user_id}`)
      .then((res) => {
        dispatch({
          type: "CART_ID",
          payload: res.data[0],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const checkStorage = () => {
  return {
    type: "CHECK_STORAGE",
  };
};

export const resetPass = (data) => {
  if (data.password == data.confirmPassword) {
    return (dispatch) => {
      Axios.post(API_URL + "/resetPass/", {
        password: data.password,
        email: data.email,
        user_id: data.user_id,
      })
        .then((res) => {
          alert("Succesfully changed password");

          dispatch({
            type: "USER_LOGIN",
            payload: res.data.dataLogin,
          });
        })
        .catch((err) => {
          alert("Login failed");
          console.log(err);
        });
    };
  } else {
    alert("Password does not match or invalid email");
  }
};
