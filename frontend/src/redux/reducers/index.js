import { combineReducers } from "redux";
import { albumReducer } from "./albumReducer";
import userReducer from "./user";
import cartReducer from "./cart";

export default combineReducers({
  user: userReducer,
  cart: cartReducer,
  albumReducer,
});
