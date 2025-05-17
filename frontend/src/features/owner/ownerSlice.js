import { createSlice } from "@reduxjs/toolkit";
import {
	getOwner,
	createOwner,
	loginOwner,
	updateOwner,
	deleteOwner,
	logoutOwner,
	changePassword,
	refreshToken,
} from "../../api/owner.js";

const ownerSlice = createSlice({
	name: "owner",
	initialState: {
		owner: null,
		isLoading: false,
		error: null,
		tokenExpiry: null,
	},
	reducers: {
		clearOwnerState: (state) => {
			state.isLoading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			// Get Owner
			.addCase(getOwner.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getOwner.fulfilled, (state, action) => {
				state.isLoading = false;
				state.owner = action.payload.owner;
				state.tokenExpiry = action.payload.tokenExpiry;
			})
			.addCase(getOwner.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Create Owner
			.addCase(createOwner.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(createOwner.fulfilled, (state, action) => {
				state.isLoading = false;
			})
			.addCase(createOwner.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Login Owner
			.addCase(loginOwner.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(loginOwner.fulfilled, (state, action) => {
				state.isLoading = false;
				state.owner = action.payload.owner;
				state.tokenExpiry = action.payload.tokenExpiry;
			})
			.addCase(loginOwner.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Update Owner
			.addCase(updateOwner.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(updateOwner.fulfilled, (state, action) => {
				state.isLoading = false;
				state.owner = action.payload.owner;
				state.tokenExpiry = action.payload.tokenExpiry;
			})
			.addCase(updateOwner.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Delete Owner
			.addCase(deleteOwner.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteOwner.fulfilled, (state) => {
				state.isLoading = false;
				state.owner = null;
			})
			.addCase(deleteOwner.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Logout Owner
			.addCase(logoutOwner.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(logoutOwner.fulfilled, (state) => {
				state.isLoading = false;
				state.owner = null;
			})
			.addCase(logoutOwner.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

			// Change Password
			.addCase(changePassword.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(changePassword.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tokenExpiry = action.payload.tokenExpiry;
			})
			.addCase(changePassword.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})

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
			});
	},
});

export const { clearOwnerState } = ownerSlice.actions;
export default ownerSlice.reducer;
