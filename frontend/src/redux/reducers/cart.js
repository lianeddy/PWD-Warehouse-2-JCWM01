const init_state = {
    cartList:[],
    transaction: [],
  };
  
  const reducer = (state = init_state, action) => {
    switch (action.type) {
      case "CART_ITEMS":
        return { ...state,cartList: action.payload };
      case "TRANSACTION":
        return { ...state,cartList: action.payload };
      default:
          return state;
    }
  };
  
  export default reducer;