import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { auth, error, security } from "../utils/logger.js";
import { generateToken } from "../utils/tokenGenerator.js";
import { Cart } from "../models/cart.model.js";

const registerUser = asyncHandler(async (req, res) => {
	auth("Received request to register user");

	const { fullname, email, username, password, contact } = req.body;

	// validate data
	if (
		[fullname, email, username, password, contact].some(
			(field) => field?.trim() === ""
		)
	) {
		error("User registration failed: All fields are required");
		throw new ApiError(400, "All fields are required");
	}

	// check if user already exists
	auth("Checking if user already exists");
	const existingUser = await User.findOne({
		$or: [{ username }, { email }, { contact }],
	});

	if (existingUser) {
		let duplicateField = "";

		if (existingUser.username === username) {
			duplicateField = "Username already exists";
		} else if (existingUser.email === email) {
			duplicateField = "Email already exists";
		} else if (existingUser.contact === contact) {
			duplicateField = "Contact number already exists";
		}

		error("User registration failed: " + duplicateField);
		throw new ApiError(duplicateField, 400);
	}

	// create user
	auth("Creating new user");
	const user = await User.create({
		fullname,
		email,
		username,
		password,
		contact,
		role: "user",
	});

	// check if user created successfully
	if (!user) {
		error("User creation failed");
		throw new ApiError("User not created", 500);
	}

	// generate token
	auth("Generating tokens");
	const { accessToken, refreshToken, tokenExpiry } = await generateToken(user);

	const createdUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	auth("User created successfully");

	// send response
	return res
		.status(201)
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
				createdUser,
				{ tokenExpiry },
				"User created successfully"
			)
		);
});

const loginUser = asyncHandler(async (req, res) => {
	auth("Received request to login user");

	// get data from req.body
	const { username, password } = req.body;

	// validate data
	if ([username, password].some((field) => field?.trim() === "")) {
		error("User login failed: All fields are required");
		throw new ApiError("All fields are required", 400);
	}

	// check if user exists
	auth("Checking if user exists");
	const user = await User.findOne({ username }).select("-refreshToken");

	if (!user) {
		error("User login failed: User not found");
		throw new ApiError("User not found", 404);
	}

	// check if password is correct
	auth("Checking if password is correct");
	const isPasswordCorrect = await user.isValidPassword(password);

	if (!isPasswordCorrect) {
		error("User login failed: Password is incorrect");
		throw new ApiError("username or password is incorrect", 401);
	}

	// check if cart exists
	auth("Checking if cart exists");
	const existingCart = await Cart.findOne({ user: user._id });

	const cart =
		existingCart || (await Cart.create({ user: user._id, products: [] }));

	await User.findOneAndUpdate(
		user._id,
		{
			cart: cart._id,
		},
		{ new: true }
	);

	// generate token
	auth("Generating tokens....");
	const {
		accessToken,
		refreshToken: newRefreshToken,
		tokenExpiry,
	} = await generateToken(user);

	const loggedInUser = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	auth("User logged in successfully");

	// send response
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
				loggedInUser,
				{ tokenExpiry },
				"User logged in successfully"
			)
		);
});

const getUser = asyncHandler(async (req, res) => {
	auth("Received request to get user");

	// Find the cart for the user
	const cart = await Cart.findOne({ user: req.user._id });

	// If the cart exists, populate the user data
	let user = null;
	if (cart) {
		auth("Populating user data");
		user = await User.findById(req.user._id)
			.populate("cart")
			.populate({
				path: "orders",
				populate: {
					path: "products",
					populate: [
						{
							path: "product",
							select: "-createdAt -updatedAt -__v -image -stock", // remove these fields from product
						},
						{
							path: "owner",
							select: "fullname email", // show only selected fields from owner
						},
					],
				},
			})
			.select("-password -refreshToken")
			.catch((err) => {
				error("Unexpected error while populating user", err);
				throw new ApiError("Internal Server Error", 500);
			});

		await user.save();
	} else {
		user = await User.findById(req.user._id).select("-password -refreshToken");
	}

	if (!user) {
		error("User not found");
		throw new ApiError("User not found", 404);
	}

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

	// Respond with the populated user data
	return res
		.status(200)
		.json(new ApiResponse(200, user, { tokenExpiry }, "User found"));
});

const logoutUser = asyncHandler(async (req, res) => {
	auth("Received request to logout user");

	const { refreshToken } = req.cookies;

	if (!refreshToken) {
		error("User logout failed: Refresh token not found");
		throw new ApiError("Refresh token not found", 401);
	}

	const decoded = jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_JWT_SECRET
	);

	const user = await User.findById(decoded?.id);

	if (!user) {
		error("User logout failed: User not found");
		throw new ApiError("User not found", 404);
	}

	user.refreshToken = null;
	await user.save();

	auth("User logged out successfully");

	return res
		.status(200)
		.clearCookie("accessToken")
		.clearCookie("refreshToken")
		.json(new ApiResponse(200, null, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
	auth("Received request to refresh access token");

	const refreshToken = req.cookies?.refreshToken;

	if (!refreshToken) {
		error("Access token refresh failed: Refresh token not found");
		throw new ApiError("Refresh token not found", 401);
	}

	try {
		auth("Checking if refresh token is valid");
		const decoded = jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_JWT_SECRET
		);

		const user = await User.findById(decoded?.id);

		if (!user) {
			error("Access token refresh failed: Refresh token is invalid");
			throw new ApiError("Refresh token is invalid", 401);
		}

		auth("Generating new access and refresh tokens");
		const {
			accessToken,
			refreshToken: newRefreshToken,
			tokenExpiry,
		} = await generateToken(user);

		const isValidRefreshToken = await user.isValidRefreshToken(refreshToken);

		if (!isValidRefreshToken) {
			error("Access token refresh failed: Refresh token is invalid");
			throw new ApiError("Refresh token is invalid", 401);
		}

		user.refreshToken = newRefreshToken;
		await user.save();

		auth("Access token refreshed successfully");

		return res
			.status(200)
			.cookie("accessToken", accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production", // Only use in production
				sameSite: "strict",
			})
			.cookie("refreshToken", newRefreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production", // Only use in production
				sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
			})
			.json(
				new ApiResponse(
					200,
					{ tokenExpiry },
					"Access token refreshed successfully"
				)
			);
	} catch (err) {
		error("Access token refresh failed: Invalid refresh token");
		throw new ApiError("Invalid refresh token", 401, err.message);
	}
});

const changePassword = asyncHandler(async (req, res) => {
	security("Received request to change password");

	const user = req.user;
	const loggedInUser = await User.findById(user._id);

	if (!loggedInUser) {
		error("Security :: User not found");
		throw new ApiError("User not found", 404);
	}

	const { oldPassword, newPassword } = req.body;

	if (!oldPassword && oldPassword?.trim() === "") {
		error("Security :: Old password is required");
		throw new ApiError("Old password is required", 400);
	}

	security("Checking if old password is correct");
	const isOldPasswordCorrect = await loggedInUser.isValidPassword(oldPassword);

	if (!isOldPasswordCorrect) {
		error("Security :: Old password is incorrect");
		throw new ApiError("Old password is incorrect", 401);
	}

	security("Checking if new password is valid");
	if (!newPassword || newPassword?.trim() === "") {
		error("Security :: New password is invalid");
		throw new ApiError("New password is invalid", 400);
	}

	if (oldPassword === newPassword) {
		error("Security :: New password must be different from old password");
		throw new ApiError("New password must be different from old password", 400);
	}

	security("Updating password");
	loggedInUser.password = newPassword;
	await loggedInUser.save();

	security("Generating new access and refresh tokens");
	const { accessToken, refreshToken: newRefreshToken } = await generateToken(
		loggedInUser
	);

	security("Password changed successfully");

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
		.json(new ApiResponse(200, null, "Password changed successfully"));
});

export {
	registerUser,
	loginUser,
	getUser,
	logoutUser,
	refreshAccessToken,
	changePassword,
};
