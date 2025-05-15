import { createSlice } from "@reduxjs/toolkit";
import {
	getCart,
	addProductToCart,
	removeProductFromCart,
	updateQuantityInCart,
	clearCart,
} from "../../api/cart.js";

const cartSlice = createSlice({
	name: "cart",
	initialState: {
		cart: [],
		error: null,
		isLoading: false,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Get Cart
			.addCase(getCart.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getCart.fulfilled, (state, action) => {
				state.isLoading = false;
				state.cart = action.payload.data;
			})
			.addCase(getCart.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Add Product to Cart
			.addCase(addProductToCart.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(addProductToCart.fulfilled, (state, action) => {
				state.isLoading = false;
				state.cart = action.payload;
			})
			.addCase(addProductToCart.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Remove Product from Cart
			.addCase(removeProductFromCart.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(removeProductFromCart.fulfilled, (state, action) => {
				state.isLoading = false;
				state.cart = action.payload;
			})
			.addCase(removeProductFromCart.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Update Quantity in Cart
			.addCase(updateQuantityInCart.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateQuantityInCart.fulfilled, (state, action) => {
				state.isLoading = false;
				state.cart = action.payload;
			})
			.addCase(updateQuantityInCart.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Clear Cart
			.addCase(clearCart.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(clearCart.fulfilled, (state, action) => {
				state.isLoading = false;
				state.cart = action.payload;
			})
			.addCase(clearCart.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export default cartSlice.reducer;
