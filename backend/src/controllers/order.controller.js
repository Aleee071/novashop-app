import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { error, orderLog } from "../utils/logger.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const createOrder = asyncHandler(async (req, res) => {
	// create order logic
	// get cart data from req.user
	// find cart and populate it
	// create order
	// send response

	orderLog("Received request to create order");
	const user = req.user;

	const { shippingAddress } = req.body;

	if (!shippingAddress) {
		error("Order creation failed: Shipping address is required");
		throw new ApiError("Shipping address is required", 400);
	}

	orderLog("Checking if cart exists");
	const existingCart = await Cart.findOne({ _id: user.cart });

	if (!existingCart) {
		error("Order creation failed: Cart not found");
		throw new ApiError("Cart not found", 404);
	}

	if (existingCart.products.length === 0) {
		error("Order creation failed: Cart is empty");
		throw new ApiError("Cart is empty", 400);
	}

	orderLog("Checking if products exist");
	const productsWithOwners = await Promise.all(
		existingCart.products.map(async (item) => {
			if (!item?.product) return null;

			const product = await Product.findById(item.product).select("owner");

			if (!product) {
				error(`Order creation failed: Product ${item.product} not found`);
				throw new ApiError(`Product ${item.product} not found`, 404);
			}

			return {
				product: product._id,
				quantity: item.quantity,
				owner: product.owner,
			};
		})
	);

	const totalPrice = existingCart.totalPrice;

	orderLog("Creating order");

	const order = await Order.create({
		user: user._id,
		products: productsWithOwners,
		totalPrice,
		shippingAddress,
	});

	if (!order) {
		error("Order creation failed: Order not created");
		throw new ApiError("Order not created", 500);
	}

	await User.findByIdAndUpdate(
		user._id,
		{ $push: { orders: order._id } },
		{ new: true }
	);

	orderLog("Order created successfully");
	await Cart.findOneAndUpdate(
		{ _id: user.cart },
		{ $set: { products: [], totalPrice: 0 } }
	);

	return res.status(201).json(new ApiResponse(201, order, "Order created"));
});

const getOrderById = asyncHandler(async (req, res) => {
	// Get order logic
	// get order id from req.params
	// find order
	// send response

	orderLog("Received request to get order");
	const { id } = req.params;

	orderLog("Validating order id....");
	if (!mongoose.isValidObjectId(id)) {
		error("Order retrieval failed: Invalid order id");
		throw new ApiError("Invalid order id", 400);
	}

	orderLog("Checking if order exists");
	const order = await Order.findById(id);

	if (!order) {
		error("Order retrieval failed: Order not found");
		throw new ApiError("Order not found", 404);
	}

	orderLog("Order retrieved successfully");
	return res.status(200).json(new ApiResponse(200, order, "Order found"));
});

const getOrdersByOwner = asyncHandler(async (req, res) => {
	orderLog("Received request to get orders by owner");

	const ownerId = req.user?._id;

	if (!ownerId) {
		error("Owner ID not found in request");
		throw new ApiError("Unauthorized access", 401);
	}

	orderLog("Fetching orders for owner", { ownerId });

	const orders = await Order.find({
		products: { $elemMatch: { owner: ownerId } },
	}).populate([
		{
			path: "products.product",
			select: "name price discount",
		},
		{
			path: "products.owner",
			select: "fullname",
		},
	]);

	if (!orders.length) {
		error("No orders found for owner", { ownerId });
		throw new ApiError("No orders found", 404);
	}

	orderLog("Orders retrieved successfully", { count: orders.length });

	return res
		.status(200)
		.json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

const getOrdersByUser = asyncHandler(async (req, res) => {
	orderLog("Received request to get orders by user");

	const userId = req.user?._id;

	if (!userId) {
		error("User ID not found in request");
		throw new ApiError("Unauthorized access", 401);
	}

	orderLog("Fetching orders for user", { userId });

	const orders = await Order.find({ user: userId }).populate({
		path: "products.product",
		select: "name",
	});

	if (!orders.length) {
		error("No orders found for user", { userId });
		throw new ApiError("No orders found", 404);
	}

	orderLog("Orders retrieved successfully", { count: orders.length });

	return res
		.status(200)
		.json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
	// Update order status logic
	// get order id from req.params
	// get status from req.body
	// find order
	// update order
	// send response

	orderLog("Received request to update order status");
	const { id } = req.params;
	const { status } = req.body;
	const ownerId = req.user._id;

	orderLog("Validating order id....");
	if (!mongoose.isValidObjectId(id)) {
		error("Order update failed: Invalid order id");
		throw new ApiError("Invalid order id", 400);
	}

	orderLog("Checking if order exists");
	const orderToUpdate = await Order.findOne({
		_id: id,
		"products.owner": ownerId,
	});

	if (!orderToUpdate) {
		error("Order update failed: Order not found");
		throw new ApiError("Order not found", 404);
	}

	orderLog("Validating status transition");
	const validStatusTransitions = {
		Pending: ["Shipped"],
		Shipped: ["Delivered"],
		Delivered: [],
	};

	if (!validStatusTransitions[orderToUpdate.status].includes(status)) {
		error(`Invalid status transition: ${orderToUpdate.status} → ${status}`);
		throw new ApiError(
			`Cannot change order status from ${orderToUpdate.status} to ${status}`,
			400
		);
	}

	orderLog("Updating order status");

	orderToUpdate.status = status;
	await orderToUpdate.save();

	orderLog("Order status updated successfully");

	return res
		.status(200)
		.json(new ApiResponse(200, orderToUpdate, "Order status updated"));
});

const deleteOrder = asyncHandler(async (req, res) => {
	// Delete order logic
	// get order id from req.params
	// find order
	// delete order
	// send response

	orderLog("Received request to delete order");
	const { id } = req.params;

	orderLog("Validating order id....");
	if (!mongoose.isValidObjectId(id)) {
		error("Order deletion failed: Invalid order id");
		throw new ApiError("Invalid order id", 400);
	}

	orderLog("Checking if order exists");
	const orderToDelete = await Order.findById(id);

	if (!orderToDelete) {
		error("Order deletion failed: Order not found");
		throw new ApiError("Order not found", 404);
	}

	orderLog("Deleting order....");
	await Order.findByIdAndDelete(id);
	await User.findOneAndUpdate(
		orderToDelete.user,
		{
			$pull: { orders: id },
		},
		{ new: true }
	);

	orderLog("Order deleted successfully");
	return res.status(200).json(new ApiResponse(200, orderToDelete, "Order deleted"));
});

export {
	createOrder,
	getOrderById,
	getOrdersByOwner,
	getOrdersByUser,
	updateOrderStatus,
	deleteOrder,
};
