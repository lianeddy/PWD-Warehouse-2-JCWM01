const init_state = {
  username: "",
  fullName: "",
  email: "",
  auth_status: "",
  id: 0,
  errMsg: "",
  searchProduct:"",
  storageIsChecked: false,
};

const reducer = (state = init_state, action) => {
  switch (action.type) {
    case "SEARCH_PRODUCT":
      return { ...state, ...action.payload };
    case "USER_LOGIN":
      return { ...state, ...action.payload };
    case "USER_ERROR":
      return { ...state, errMsg: action.payload };
    case "USER_LOGOUT":
      return { ...init_state };
    default:
      return state;
  }
};

export default reducer;
