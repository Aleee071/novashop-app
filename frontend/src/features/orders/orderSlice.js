import { createSlice } from "@reduxjs/toolkit";
import {
	getOrderById,
	createOrder,
	getOrdersByOwner,
	deleteOrder,
	updateOrder,
	getOrdersByUser,
} from "../../api/order.js";

const orderSlice = createSlice({
	name: "order",
	initialState: {
		ordersByUser: [],
		ordersByOwner: [],
		order: null,
		error: null,
		isLoading: false,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Get Order By Id
			.addCase(getOrderById.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getOrderById.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.order = action.payload;
			})
			.addCase(getOrderById.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Create Order
			.addCase(createOrder.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(createOrder.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Get Orders By Owner
			.addCase(getOrdersByOwner.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getOrdersByOwner.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.ordersByOwner = action.payload.data;
			})
			.addCase(getOrdersByOwner.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Delete Order
			.addCase(deleteOrder.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteOrder.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.ordersByUser = state.ordersByUser.filter(
					(order) => order._id !== action.payload._id
				);
			})
			.addCase(deleteOrder.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Update Order
			.addCase(updateOrder.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateOrder.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;

				state.ordersByOwner = state.ordersByOwner.map((order) => {
					if (order._id === action.payload._id) {
						return {
							...order,
							status: action.payload.status,
						};
					}
					return order;
				});
			})
			.addCase(updateOrder.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Get orders by user
			.addCase(getOrdersByUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getOrdersByUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.ordersByUser = action.payload.data;
			})
			.addCase(getOrdersByUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export default orderSlice.reducer;
