import { createSlice } from "@reduxjs/toolkit";
import {
	getProducts,
	getProduct,
	deleteProduct,
	createProduct,
	updateProduct,
	getProductsByOwner,
} from "../../api/product";

const productSlice = createSlice({
	name: "product",
	initialState: {
		products: [],
		productsByOwner: [],
		currentProduct: null,
		error: null,
		isLoading: false,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Get All Products
			.addCase(getProducts.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getProducts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.products = action.payload.data;
			})
			.addCase(getProducts.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Get Single Product
			.addCase(getProduct.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getProduct.fulfilled, (state, action) => {
				state.isLoading = false;
				state.currentProduct = action.payload;
			})
			.addCase(getProduct.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// get Products by owner
			.addCase(getProductsByOwner.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getProductsByOwner.fulfilled, (state, action) => {
				state.isLoading = false;
				state.productsByOwner = action.payload.data;
			})
			.addCase(getProductsByOwner.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Delete Product
			.addCase(deleteProduct.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteProduct.fulfilled, (state, action) => {
				state.isLoading = false;
				state.products = state.products.filter(
					(product) => product._id !== action.payload
				);
				state.currentProduct = null;
			})
			.addCase(deleteProduct.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Create Product
			.addCase(createProduct.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(createProduct.fulfilled, (state, action) => {
				state.isLoading = false;
				state.products.push(action.payload.data);
				state.productsByOwner.push(action.payload.data);
			})
			.addCase(createProduct.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Update Product
			.addCase(updateProduct.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateProduct.fulfilled, (state, action) => {
				state.isLoading = false;
				state.currentProduct = action.payload;
				state.productsByOwner = state.productsByOwner.map((product) =>
					product._id === action.payload?.data?._id
						? action.payload.data
						: product
				);
			})
			.addCase(updateProduct.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export default productSlice.reducer;
