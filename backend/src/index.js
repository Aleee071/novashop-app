import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicPath = path.join(__dirname, "../public"); // Move up one level to get to the public folder

app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
		credentials: true,
	})
);

app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath));

//import routes
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import ownerRouter from "./routes/owner.routes.js";
import cartRouter from "./routes/cart.routes.js";
import orderRouter from "./routes/order.routes.js";
import ApiError from "./utils/ApiError.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/owners", ownerRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);

app.use((err, req, res, next) => {
	console.log(err.stack);

	if (err instanceof ApiError) {
		return res.status(err.status).json({
			success: false,
			message: err.message,
			error: err.errors,
		});
	}

	res.status(500).json({
		success: false,
		message: "Internal Server Error",
	});
});
export default app;
