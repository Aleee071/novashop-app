import { Router } from "express";
import {
	createOrder,
	getOrderById,
	getOrdersByOwner,
	getOrdersByUser,
	updateOrderStatus,
	deleteOrder,
} from "../controllers/order.controller.js";
import verifyjwt from "../middlewares/verifyjwt.middleware.js";
import authorizeRole from "../middlewares/roleAuthorization.middleware.js";

const orderRouter = Router();

orderRouter
	.route("/create")
	.post(verifyjwt, authorizeRole(["user"]), createOrder);
orderRouter
	.route("/owner-orders")
	.get(verifyjwt, authorizeRole(["owner"]), getOrdersByOwner);
orderRouter
	.route("/my-orders")
	.get(verifyjwt, authorizeRole(["user"]), getOrdersByUser);

orderRouter.route("/:id").get(verifyjwt, authorizeRole(["user"]), getOrderById);
orderRouter
	.route("/status/:id")
	.patch(verifyjwt, authorizeRole(["owner"]), updateOrderStatus);
orderRouter
	.route("/delete/:id")
	.delete(verifyjwt, authorizeRole(["user"]), deleteOrder);

export default orderRouter;
