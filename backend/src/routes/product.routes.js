import { Router } from "express";
import verifyjwt from "../middlewares/verifyjwt.middleware.js";
import authorizeRole from "../middlewares/roleAuthorization.middleware.js";
import optimizeImage from "../middlewares/optimizeImage.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
	createProduct,
	deleteProduct,
	getProduct,
	getAllProducts,
	updateProduct,
	getProductsByOwner,
} from "../controllers/product.controller.js";

const productRouter = Router();

productRouter
	.route("/create")
	.post(
		verifyjwt,
		authorizeRole(["owner"]),
		upload.single("image"),
		optimizeImage,
		createProduct
	);
productRouter
	.route("/delete/:id")
	.delete(verifyjwt, authorizeRole(["owner"]), deleteProduct);
productRouter.route("/").get(getAllProducts);
productRouter.route("/product/:id").get(getProduct);
productRouter
	.route("/owner")
	.get(verifyjwt, authorizeRole(["owner"]), getProductsByOwner);
productRouter
	.route("/update/:id")
	.put(
		verifyjwt,
		authorizeRole(["owner"]),
		upload.single("image"),
		optimizeImage,
		updateProduct
	);

export default productRouter;
