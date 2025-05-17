import { createSlice } from "@reduxjs/toolkit";
import {
	registerUser,
	loginUser,
	getUser,
	logoutUser,
	refreshToken,
} from "../../api/auth.js";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: null,
		error: null,
		isLoading: false,
		tokenExpiry: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Register User
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.isLoading = false;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Login User
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.tokenExpiry = action.payload.tokenExpiry;
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Get User
			.addCase(getUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getUser.fulfilled, (state, action) => {
				state.isLoading = false;
				state.user = action.payload.user;
				state.tokenExpiry = action.payload.tokenExpiry;
			})
			.addCase(getUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
				state.user = null;
				state.tokenExpiry = null;
			})

			// Logout User
			.addCase(logoutUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.isLoading = false;
				state.error = null;
				state.tokenExpiry = null;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Refresh Token
			.addCase(refreshToken.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(refreshToken.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tokenExpiry = action.payload.tokenExpiry;
			})
			.addCase(refreshToken.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
				state.user = null;
				state.tokenExpiry = null;
			});
	},
});

export default authSlice.reducer;
