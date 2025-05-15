import ApiError from "../utils/ApiError.js";
import { error } from "../utils/logger.js";

const authorizeRole = (allowedRoles) => {
	return (req, _, next) => {
		const role = req.user?.role;

		if (!allowedRoles.includes(role)) {
			error(`Unauthorized action for role: ${role}`);
			throw new ApiError(`Unauthorized action for role: ${role}`, 403); // Forbidden
		}
		next();
	};
};

export default authorizeRole;
