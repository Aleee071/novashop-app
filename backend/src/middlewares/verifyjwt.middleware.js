import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { error, security } from "../utils/logger.js";
import { User } from "../models/user.model.js";
import { Owner } from "../models/owner.model.js";

const verifyjwt = asyncHandler(async function (req, _, next) {
	const token =
		req.cookies?.accessToken ||
		req.headers["Authorization"]?.replace("Bearer ", "");

	if (!token) {
		error("User not authenticated");
		throw new ApiError("User not authenticated", 401);
	}

	try {
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_JWT_SECRET);
		if (!decoded) {
			error("Invalid token");
			throw new ApiError("Invalid token", 401);
		}

		const { role } = decoded;
		security("Identifying user role....");

		let user;

		if (role === "user") {
			user = await User.findById(decoded?.id).select("-refreshToken -password");
			security("requester is a user!....");
		} else if (role === "owner") {
			user = await Owner.findById(decoded?.id).select(
				"-refreshToken -password"
			);
			security("requester is an owner!....");
		}

		if (!user) {
			error("User or Owner not found");
			throw new ApiError("User or Owner not found", 404);
		}

		req.user = user;
		next();
	} catch (err) {
		error(`JWT Verification Failed: ${err.message}`);
		throw new ApiError("Invalid token", 401, err.message);
	}
});

export default verifyjwt;
