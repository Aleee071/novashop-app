import API from "./instance/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunks
const registerUser = createAsyncThunk(
	"auth/register",
	async (userData, { rejectWithValue }) => {
		try {
			const response = await API.post("/users/register", userData);
			const { data, message } = response.data;
			const tokenExpiry = message?.tokenExpiry;

			return { user: data, tokenExpiry };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message || "Registration failed"
			);
		}
	}
);

const loginUser = createAsyncThunk(
	"auth/login",
	async (credentials, { rejectWithValue }) => {
		try {
			const response = await API.post("/users/login", credentials);
			const { data, message } = response.data;
			const tokenExpiry = message?.tokenExpiry;

			return { user: data, tokenExpiry };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || error.message || "Login failed"
			);
		}
	}
);

const getUser = createAsyncThunk(
	"auth/user",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.get("/users/user");
			const { data, message } = response.data;
			const tokenExpiry = message?.tokenExpiry;

			return { user: data, tokenExpiry };
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Fetching user failed"
			);
		}
	}
);

const logoutUser = createAsyncThunk(
	"auth/logout",
	async (_, { rejectWithValue }) => {
		try {
			await API.post("/users/logout");
			return null;
		} catch (error) {
			return rejectWithValue(error.response?.data?.message || error.message || "Logout failed");
		}
	}
);

const refreshToken = createAsyncThunk(
	"auth/refresh",
	async (_, { rejectWithValue }) => {
		try {
			const response = await API.post("/users/refresh-token");
			console.log("Token refreshed:", response.data.data);
			return response.data.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Token refresh failed"
			);
		}
	}
);

export { registerUser, loginUser, getUser, logoutUser, refreshToken };
