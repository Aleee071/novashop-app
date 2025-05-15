import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import productReducer from "../features/products/productSlice.js";
import cartReducer from "../features/cart/cartSlice.js";
import orderReducer from "../features/orders/orderSlice.js";
import ownerReducer from "../features/owner/ownerSlice.js";

const store = configureStore({
	reducer: {
		auth: authReducer,
		product: productReducer,
		cart: cartReducer,
		order: orderReducer,
		owner: ownerReducer,
	},
});

export default store;
