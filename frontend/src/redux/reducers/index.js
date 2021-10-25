import { combineReducers } from "redux";
import userReducer from "./user";
import { albumReducer } from './albumReducer'
// import cartReducer from "./cart";

export default combineReducers({
  user: userReducer,
  albumReducer,
  // cart: cartReducer,
});
