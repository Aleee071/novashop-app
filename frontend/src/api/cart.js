import API from "./instance/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunks
const getCart = createAsyncThunk(
	"cart/fetchCart",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.get("/cart/getCart");
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Cart retrieval failed"
			);
		}
	}
);

const addProductToCart = createAsyncThunk(
	"cart/addProductToCart",
	async ({ productId, quantity }, { rejectWithValue }) => {
		try {
			const response = await API.post(`/cart/add/${productId}`, { quantity });
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Product addition to cart failed"
			);
		}
	}
);

const removeProductFromCart = createAsyncThunk(
	"cart/removeProductFromCart",
	async (productId, { rejectWithValue }) => {
		try {
			const response = await API.delete(`/cart/remove/${productId}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Product removal from cart failed"
			);
		}
	}
);

const clearCart = createAsyncThunk(
	"cart/clearCart",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.post(`/cart/clearCart`);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message || "Cart clear failed"
			);
		}
	}
);

const updateQuantityInCart = createAsyncThunk(
	"cart/updateQuantityInCart",
	async ({ productId, quantity }, { rejectWithValue }) => {
		try {
			const response = await API.put(`/cart/update/${productId}`, { quantity });
			return response.data.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Quantity update in cart failed"
			);
		}
	}
);


export {
	getCart,
	addProductToCart,
	removeProductFromCart,
	clearCart,
	updateQuantityInCart,
};
