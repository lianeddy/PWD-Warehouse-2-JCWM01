const init_state = {
    username: "",
    email: "",
    password: "",
    fullname: "",
    gender: "",
    age: "",
    auth_status: "user"
}

export default (state = init_state, action) => {
    switch(action.type) {
        case "USER_LOGIN":
            return { ...state, ...action.payload }
        default:
            return state;
    }
}