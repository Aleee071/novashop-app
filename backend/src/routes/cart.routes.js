import { Router } from "express";
import {
	addProductToCart,
	getCart,
	deleteCart,
	removeProductFromCart,
	updateProductQuantity,
	clearCart,
} from "../controllers/cart.controller.js";
import verifyjwt from "../middlewares/verifyjwt.middleware.js";
import authorizeRole from "../middlewares/roleAuthorization.middleware.js";

const cartRouter = Router();

cartRouter.route("/getCart").get(verifyjwt, authorizeRole(["user"]), getCart);
cartRouter
	.route("/add/:id")
	.post(verifyjwt, authorizeRole(["user"]), addProductToCart);

cartRouter
	.route("/deleteCart")
	.delete(verifyjwt, authorizeRole(["user"]), deleteCart);
cartRouter
	.route("/remove/:id")
	.delete(verifyjwt, authorizeRole(["user"]), removeProductFromCart);
cartRouter
	.route("/update/:id")
	.put(verifyjwt, authorizeRole(["user"]), updateProductQuantity);
cartRouter
	.route("/clearCart")
	.post(verifyjwt, authorizeRole(["user"]), clearCart);
export default cartRouter;
