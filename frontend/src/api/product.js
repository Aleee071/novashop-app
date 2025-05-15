import API from "./instance/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunks

// Get All Products
const getProducts = createAsyncThunk(
	"products/fetchAll",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.get("/products/");
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Products retrieval failed"
			);
		}
	}
);

// Get Single Product
const getProduct = createAsyncThunk(
	"products/fetchProduct",
	async (id, { rejectWithValue }) => {
		try {
			const response = await API.get(`/products/product/${id}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Product retrieval failed"
			);
		}
	}
);

// get product by owner
const getProductsByOwner = createAsyncThunk(
	"products/fetchProductsByOwner",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.get(`/products/owner`);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Products retrieval failed"
			);
		}
	}
);

// Delete Product
const deleteProduct = createAsyncThunk(
	"products/deleteProduct",
	async (id, { rejectWithValue }) => {
		try {
			const response = await API.delete(`/products/delete/${id}`);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Product deletion failed"
			);
		}
	}
);

const createProduct = createAsyncThunk(
	"products/createProduct",
	async (productData, { rejectWithValue }) => {
		try {
			const response = await API.post("/products/create", productData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Product creation failed"
			);
		}
	}
);

// Update Product
const updateProduct = createAsyncThunk(
	"products/updateProduct",
	async ({ id, productData }, { rejectWithValue }) => {
		try {
			const response = await API.put(`/products/update/${id}`, productData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Product update failed"
			);
		}
	}
);

export {
	getProducts,
	getProduct,
	getProductsByOwner,
	deleteProduct,
	createProduct,
	updateProduct,
};
