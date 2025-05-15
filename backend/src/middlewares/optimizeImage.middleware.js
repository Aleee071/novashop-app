import sharp from "sharp";
import fs from "fs";
import path from "path";

const optimizeImage = async (req, _, next) => {
	try {
		if (!req.file) return next();

		const imagePath = req.file?.path;
		const optimizedFilename =
			"optimized-" + req.file.filename.split(".")[0] + ".webp";
		const outputPath = path.join("public/images", optimizedFilename);

		await sharp(imagePath).resize(800).webp({ quality: 80 }).toFile(outputPath);
		fs.unlinkSync(imagePath);

		req.file.filename = optimizedFilename;
		req.file.path = outputPath;

		next();
	} catch (error) {
		console.error("Error optimizing image:", error);
		throw new ApiError("Error optimizing image", 500);
	}
};

export default optimizeImage;
