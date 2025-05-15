import API from "./instance/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getOrderById = createAsyncThunk(
	"order/fetchOrder",
	async (orderId, { rejectWithValue }) => {
		try {
			const response = await API.get(`/orders/${orderId}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Order retrieval failed"
			);
		}
	}
);

const createOrder = createAsyncThunk(
	"order/createOrder",
	async (orderData, { rejectWithValue }) => {
		try {
			const response = await API.post("/orders/create", orderData);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Order creation failed"
			);
		}
	}
);

const updateOrder = createAsyncThunk(
	"order/updateOrder",
	async ({ orderId, status }, { rejectWithValue }) => {
		try {
			const response = await API.patch(`/orders/status/${orderId}`, { status });
			return response.data.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message || "Order update failed"
			);
		}
	}
);

const deleteOrder = createAsyncThunk(
	"order/deleteOrder",
	async (orderId, { rejectWithValue }) => {
		try {
			const response = await API.delete(`/orders/delete/${orderId}`);
			return response.data.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Order deletion failed"
			);
		}
	}
);

const getOrdersByOwner = createAsyncThunk(
	"order/fetchOrdersByOwner",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.get(`/orders/owner-orders`);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Orders retrieval failed"
			);
		}
	}
);

const getOrdersByUser = createAsyncThunk(
	"order/fetchOrdersByUser",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.get(`/orders/my-orders`);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Orders retrieval failed"
			);
		}
	}
);

export {
	getOrderById,
	createOrder,
	updateOrder,
	deleteOrder,
	getOrdersByOwner,
	getOrdersByUser,
};
