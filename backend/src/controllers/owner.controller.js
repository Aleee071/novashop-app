import asyncHandler from "../utils/asyncHandler.js";
import { error, owner as ownerLogger, security } from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Owner } from "../models/owner.model.js";
import { generateToken } from "../utils/tokenGenerator.js";
import { Product } from "../models/product.model.js";
import jwt from "jsonwebtoken";

// Create Owner Controller
const createOwner = asyncHandler(async (req, res) => {
	ownerLogger("Request received to create ownerLogger");

	try {
		const { fullname, username, password, contact, email } = req.body;

		ownerLogger("Validating data...", { fullname, username, contact, email });

		if (
			[fullname, username, password, contact, email].some(
				(field) => field?.trim() === ""
			)
		) {
			error("Validation failed: All fields are required.", {
				missingFields: [fullname, username, password, contact, email],
			});
			throw new ApiError("All fields are required", 400);
		}

		ownerLogger("Checking if owner already exists...", {
			email,
			username,
		});

		const isExisting = await Owner.findOne({ $or: [{ email }, { username }] });

		if (isExisting) {
			error("Owner with same username or email already exists!");
			throw new ApiError(
				"Owner with same username or email already exists",
				400
			);
		}

		ownerLogger("Creating owner in database...", {
			email,
			username,
			contact,
		});

		const createdOwner = await Owner.create({
			email,
			username,
			password,
			contact,
			fullname,
			role: "owner",
		});

		if (!createdOwner) {
			error("Owner creation failed, database error");
			throw new ApiError("Error while owner creation", 500);
		}

		security("Generating tokens for owner, ", {
			ownerId: createdOwner._id,
		});

		const { accessToken, refreshToken, tokenExpiry } = await generateToken(
			createdOwner
		);

		const owner = await Owner.findById(createdOwner._id).select(
			"-refreshToken -password -__v"
		);

		return res
			.status(200)
			.cookie("accessToken", accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			})
			.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			})
			.json(
				new ApiResponse(
					201,
					owner,
					{ tokenExpiry },
					"Owner created successfully"
				)
			);
	} catch (err) {
		error("Unexpected error during ownerLogger creation", {
			error: err.message,
			stack: err.stack,
		});
		throw new ApiError("Internal Server Error", 500);
	}
});

// Login Owner Controller
const loginOwner = asyncHandler(async (req, res) => {
	ownerLogger("Received request to login owner");

	const { email, username, password } = req.body;

	ownerLogger("Validating data...");
	if (!email && !username) {
		error("Login owner failure: Email or username is required");
		throw new ApiError("Email or username is required", 400);
	}

	if (!password) {
		error("Login owner failure: Password is required");
		throw new ApiError("Password is required", 400);
	}

	ownerLogger("Checking if owner exists...");
	let owner = await Owner.findOne({
		$or: [{ email }, { username }],
	}).select("+password"); // Select password for validation

	if (!owner) {
		error("Login owner failure: Owner not found!");
		throw new ApiError("Owner not found!", 404);
	}

	ownerLogger("Verifying password...");
	const isValidPassword = await owner.isValidPassword(password);

	if (!isValidPassword) {
		error("Login owner failure: Password is incorrect!");
		throw new ApiError("Password is incorrect!", 401);
	}

	security("Generating tokens for owner");
	const {
		accessToken,
		refreshToken: newRefreshToken,
		tokenExpiry,
	} = await generateToken(owner);

	// Convert to plain object and remove fields
	ownerLogger("Removing sensitive fields...");
	owner = owner.toObject();
	delete owner.password;
	delete owner.refreshToken;

	ownerLogger("Owner logged in successfully");

	return res
		.status(200)
		.cookie("accessToken", accessToken, {
			httpOnly: false,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		})
		.cookie("refreshToken", newRefreshToken, {
			httpOnly: false,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
		})
		.json(
			new ApiResponse(
				200,
				owner,
				{ tokenExpiry },
				"User logged in successfully"
			)
		);
});

// Get Owner Details Controller
const getOwnerDetails = asyncHandler(async (req, res) => {
	// Get owner details logic
	// get owner details from req.user
	// validate owner details
	// send response

	try {
		ownerLogger("Request received to get owner details");
		const owner = await Owner.findById(req.user._id)
			.populate("productsOwned")
			.select("-password -refreshToken -__v");

		// Get access token from cookie and decode it
		let tokenExpiry = null;
		const token = req.cookies?.accessToken;

		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET);
				tokenExpiry = decoded.exp * 1000; // Convert to ms
				console.log("Token expiry:", tokenExpiry);
			} catch (err) {
				console.error("Failed to decode token:", err.message);
				// Don't throw, just skip expiry if token is invalid
			}
		}

		return res
			.status(200)
			.json(new ApiResponse(200, owner, { tokenExpiry }, "Owner found"));
	} catch (err) {
		error("Unexpected error during owner details retrieval", err);
		throw new ApiError("Internal Server Error", 500);
	}
});

// Update Owner Details Controller
const updateOwnerDetails = asyncHandler(async (req, res) => {
	ownerLogger("Request received to update owner details", {
		requestData: req.body,
	});

	const user = req.user;

	const { username, fullname, contact } = req.body;

	if ([fullname, username, contact].some((field) => field?.trim() === "")) {
		error("Validation failed: All fields are required.", {
			missingFields: [fullname, username, contact],
		});
		throw new ApiError("All fields are required", 400);
	}

	ownerLogger("Updating owner details in the database", {
		userId: user._id,
		updateData: { username, fullname, contact },
	});

	let updatedOwner = await Owner.findByIdAndUpdate(
		user._id,
		{ username, fullname, contact },
		{ new: true }
	).select("-refreshToken -password -__v");

	ownerLogger("Owner details updated successfully", {
		userId: user._id,
		updateData: { updatedOwner },
	});

	if (!updatedOwner) {
		error("Failed to update owner", {
			userId: user._id,
			updateData: { username, fullname, contact },
		});
		throw new ApiError("Owner not found or failed to update", 500);
	}

	security("Generating new access and refresh tokens for updated owner");
	const {
		accessToken,
		refreshToken: newRefreshToken,
		tokenExpiry,
	} = await generateToken(updatedOwner);

	// Convert to plain object and remove fields
	updatedOwner = updatedOwner.toObject();
	delete updatedOwner.password;
	delete updatedOwner.refreshToken;

	ownerLogger("Owner details updated successfully");
	return res
		.status(200)
		.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		})
		.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		})
		.json(
			new ApiResponse(
				200,
				updatedOwner,
				{ tokenExpiry },
				"Owner details updated successfully"
			)
		);
});

// Change Password Controller
const changePassword = asyncHandler(async (req, res) => {
	ownerLogger("Request received to change owner password");

	const { oldPassword, newPassword } = req.body;

	if (!oldPassword || !newPassword) {
		error("Validation failed: All fields are required.");
		throw new ApiError("All fields are required", 400);
	}

	const owner = await Owner.findById(req.user?._id);

	if (!owner) {
		error("Owner not found");
		throw new ApiError("Owner not found", 404);
	}

	const isValidPassword = await owner.isValidPassword(oldPassword);

	if (!isValidPassword) {
		error("Old password is incorrect");
		throw new ApiError("Old password is incorrect", 401);
	}

	owner.password = newPassword;
	await owner.save();

	security("Generating new access and refresh tokens for updated owner");

	const {
		accessToken,
		refreshToken: newRefreshToken,
		tokenExpiry,
	} = await generateToken(owner);

	ownerLogger("Owner password changed successfully");

	return res
		.status(200)
		.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		})
		.cookie("refreshToken", newRefreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
		})
		.json(new ApiResponse(200, { tokenExpiry }, "Password changed"));
});

// Logout Owner Controller
const logoutOwner = asyncHandler(async (req, res) => {
	// Logout owner logic
	// get user from req.user
	// validate refresh token
	// update refresh token in owner model
	// send response

	ownerLogger("Received request to logout owner", {
		userId: req.user._id,
	});

	const user = req.user;

	if (!user) {
		error("Owner not found", { userId: req.user._id });
		throw new ApiError("Owner not found", 404);
	}

	await Owner.findByIdAndUpdate(
		user._id,
		{ refreshToken: null },
		{ new: true }
	);

	return res
		.status(200)
		.clearCookie("accessToken")
		.clearCookie("refreshToken")
		.json(new ApiResponse(200, null, "Owner logged out successfully"));
});

// Delete Owner Controller
const deleteOwner = asyncHandler(async (req, res) => {
	ownerLogger("Request received to delete owner", {
		userId: req.user._id,
	});

	const user = req.user;

	if (!user) {
		error("Owner not found", { userId: req.user._id });
		throw new ApiError("Owner not found", 404);
	}

	ownerLogger("Deleting products related to owner....", {
		userId: user._id,
	});

	await Product.deleteMany({ owner: user._id });

	user.refreshToken = null;

	ownerLogger("Removing refresh token from owner", { userId: user._id });

	await user.save();

	ownerLogger("Deleting owner record from database...", {
		userId: user._id,
	});

	await Owner.findByIdAndDelete(user._id);

	return res
		.status(200)
		.json(new ApiResponse(200, null, "Owner deleted successfully"));
});

const refreshToken = asyncHandler(async (req, res) => {
	// refresh token logic
	// get refresh token from req.cookies
	// validate refresh token
	// generate new access and refresh token
	// update refresh token in owner model
	// send response

	ownerLogger("Received request to refresh owner token");
	const refreshToken = req.cookies?.refreshToken;

	ownerLogger("Validating refresh token....");
	if (!refreshToken) {
		error("Access token refresh failed: Refresh token not found");
		throw new ApiError("Refresh token not found", 401);
	}

	try {
		ownerLogger("Checking if refresh token is valid");
		const decoded = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_JWT_SECRET
		);

		const owner = await Owner.findById(decoded?.id);
		ownerLogger("Owner found", { ownerId: owner._id });

		if (!owner) {
			error("Access token refresh failed: Refresh token is invalid");
			throw new ApiError("Refresh token is invalid", 401);
		}

		ownerLogger("Generating new access and refresh tokens");
		const {
			accessToken,
			refreshToken: newRefreshToken,
			tokenExpiry,
		} = await generateToken(owner);

		const isValidRefreshToken = await owner.isValidRefreshToken(refreshToken);

		if (!isValidRefreshToken) {
			error("Access token refresh failed: Refresh token is invalid");
			throw new ApiError("Refresh token is invalid", 401);
		}

		owner.refreshToken = newRefreshToken;
		await owner.save();

		ownerLogger("Access token refreshed successfully");
		return res
			.status(200)
			.cookie("accessToken", accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			})
			.cookie("refreshToken", newRefreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			})
			.json(new ApiResponse(200, { tokenExpiry }, "Token refreshed"));
	} catch (err) {
		error("Access token refresh failed: ", err);
		throw new ApiError(err || "Refresh token is invalid", 401);
	}
});

export {
	createOwner,
	loginOwner,
	getOwnerDetails,
	updateOwnerDetails,
	changePassword,
	logoutOwner,
	deleteOwner,
	refreshToken,
};
