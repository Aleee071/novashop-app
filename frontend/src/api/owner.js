import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "./instance/axiosInstance";

const getOwner = createAsyncThunk(
	"owner/fetchOwner",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.get("/owners/details");
			const { data, message } = response.data;
			const tokenExpiry = message?.tokenExpiry;

			if (!data) {
				return rejectWithValue("Owner not found");
			}

			return { owner: data, tokenExpiry };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Owner retrieval failed"
			);
		}
	}
);

const createOwner = createAsyncThunk(
	"owner/createOwner",
	async (ownerData, { rejectWithValue }) => {
		try {
			const response = await API.post("/owners/create", ownerData);
			const { data, message } = response.data;
			const tokenExpiry = message?.tokenExpiry;

			return { owner: data, tokenExpiry };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Owner creation failed"
			);
		}
	}
);

const loginOwner = createAsyncThunk(
	"owner/loginOwner",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await API.post("/owners/login", credentials);
			const { data, message } = response.data;
			const tokenExpiry = message?.tokenExpiry;

			return { owner: data, tokenExpiry };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message || "Login failed"
			);
		}
	}
);

const updateOwner = createAsyncThunk(
	"owner/updateOwner",
	async (ownerData, { rejectWithValue }) => {
		try {
			const response = await API.post(`/owners/update`, ownerData);
			const { data, message } = response.data;
			const tokenExpiry = message?.tokenExpiry;

			return { owner: data, tokenExpiry };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message || "Owner update failed"
			);
		}
	}
);

const deleteOwner = createAsyncThunk(
	"owner/deleteOwner",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.delete(`/owners/delete`);
			return response.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Owner deletion failed"
			);
		}
	}
);

const logoutOwner = createAsyncThunk(
	"owner/logout",
	async (_, { rejectWithValue }) => {
		try {
			await API.post("/owners/logout");
			return null;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message || "Logout failed"
			);
		}
	}
);

const changePassword = createAsyncThunk(
	"owner/changePassword",
	async (passwordData, { rejectWithValue }) => {
		try {
			const response = await API.post("/owners/change-password", passwordData);
			const { data, message } = response.data;
			const tokenExpiry = new Date(data?.tokenExpiry).getTime();

			return { tokenExpiry, message };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message ||
					error.message ||
					"Password change failed"
			);
		}
	}
);

const refreshToken = createAsyncThunk(
	"owner/refreshToken",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.post("/owners/refresh-token");
			const { data, message } = response.data;
			const tokenExpiry = new Date(data?.tokenExpiry).getTime();

			return { tokenExpiry, message };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Token refresh failed"
			);
		}
	}
);

export {
	getOwner,
	createOwner,
	loginOwner,
	updateOwner,
	deleteOwner,
	logoutOwner,
	changePassword,
	refreshToken,
};
