import multer from "multer";
import crypto from "crypto";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "./public/images");
	},

	filename: function (_, file, cb) {
		const uniqueSuffix = crypto.randomBytes(16).toString("hex");
		cb(null, uniqueSuffix + "-" + file.originalname);
	},
});

export const upload = multer({ storage });
