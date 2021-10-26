const init_state = {
    cartList:[]
  };
  
  const reducer = (state = init_state, action) => {
    switch (action.type) {
      case "CART_ITEMS":
        return { ...state,cartList: action.payload };
      default:
          return state;
    }
  };
  
  export default reducer;