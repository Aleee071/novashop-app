import jwt from "jsonwebtoken";
import { error } from "./logger.js";
import ApiError from "./ApiError.js";
import { Owner } from "../models/owner.model.js";

export const generateToken = async (user) => {
	const accessSecret = process.env.ACCESS_TOKEN_JWT_SECRET;
	const refreshSecret = process.env.REFRESH_TOKEN_JWT_SECRET;

	if (!accessSecret || !refreshSecret) {
		error("!!! JWT secrets are required");
		throw new ApiError(
			"!!! JWT secrets are required, please check your environment variables",
			500
		);
	}

	const accessExpiresIn = 60 * 60; // 1 hour in seconds
	const refreshExpiresIn = 7 * 24 * 60 * 60; // 7 days in seconds

	const role = user instanceof Owner ? "owner" : "user";

	const accessToken = jwt.sign(
		{ id: user._id, email: user.email, role },
		accessSecret,
		{
			expiresIn: accessExpiresIn,
		}
	);
	const refreshToken = jwt.sign({ id: user._id }, refreshSecret, {
		expiresIn: refreshExpiresIn,
	});

	user.refreshToken = refreshToken;
	await user.save();

	const tokenExpiry = new Date(Date.now() + accessExpiresIn * 1000);

	return {
		accessToken,
		refreshToken,
		tokenExpiry,
	};
};
