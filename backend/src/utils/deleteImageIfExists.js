import { error } from "./logger.js";
import ApiError from "./ApiError.js";
import { promises as fs } from "fs";
import path from "path";

const deleteImageIfExists = async (image) => {
	if (image) {
		try {
			const imagePath = path.join("public/images", image);
			await fs.unlink(imagePath);
		} catch (err) {
			error("Error deleting image:", err.message);
			throw new ApiError("Error deleting image", 500);
		}
	}
};

export { deleteImageIfExists };
