import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { error, cartLog } from "../utils/logger.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { User } from "../models/user.model.js";

const addProductToCart = asyncHandler(async (req, res) => {
	// Add product to cart logic
	// get product id from req.params
	// get quantity from req.body
	// get user from req.user
	// check if product exists
	// check if quantity is valid || quantity > stock
	// reduce stock as per quantity
	// check if cart already exists
	// add product to cart
	// send response

	cartLog("Received request to create cart");

	// get product id from req.params
	cartLog("Validating product id....");
	const { id } = req.params;
	const user = req.user;

	if (!mongoose.isValidObjectId(id)) {
		error("Cart creation failed: Invalid product id");
		throw new ApiError("Invalid product id", 400);
	}

	// get quantity from req.body
	const { quantity } = req.body;
	cartLog("Received quantity: " + quantity);

	if (quantity <= 0) {
		error("Cart creation failed: Quantity must be greater than 0");
		throw new ApiError("Quantity must be greater than 0", 400);
	}

	if (quantity === undefined || isNaN(Number(quantity))) {
		error("Cart creation failed: Invalid or missing quantity");
		throw new ApiError("Invalid or missing quantity", 400);
	}

	// check if product exists
	cartLog("Checking if product exists");
	const productExists = await Product.findById(id);

	if (!productExists) {
		error("Cart creation failed: Product not found");
		throw new ApiError("Product not found", 404);
	}

	// check if quantity is valid || quantity > stock
	if (quantity > productExists.stock) {
		error("Cart creation failed: Not enough stock");
		throw new ApiError("Not enough stock", 400);
	}

	// reduce stock as per quantity
	productExists.stock -= Number(quantity);
	await productExists.save();
	// check if cart already exists
	cartLog("Checking if cart already exists");
	const existingCart = await Cart.findOne({
		user: user._id,
	});

	// add product to cart
	cartLog("Adding product to cart");

	let cart;
	if (!existingCart) {
		cart = await Cart.create({
			user: user._id,
			products: [
				{
					product: productExists,
					quantity,
				},
			],
		});

		if (!cart) {
			error("Cart creation failed : Cart not created");
			throw new ApiError("Cart creation failed", 500);
		}
	} else {
		const existingProductIndex = existingCart.products.findIndex(
			(item) => item.product._id.toString() === id
		);

		if (existingProductIndex !== -1) {
			cartLog("Product already exists in cart");
			existingCart.products[existingProductIndex].quantity += Number(quantity);
		} else {
			cartLog("The product you're trying to add to the cart does not exist.");
			existingCart.products.push({
				product: id,
				quantity,
			});
		}

		await existingCart.save();
		cart = existingCart;
	}

	await cart.save();

	cartLog("Cart created successfully");
	return res
		.status(200)
		.json(new ApiResponse(200, cart, "Product(s) added to cart"));
});

const getCart = asyncHandler(async (req, res) => {
	// Get cart logic
	// get user from req.user
	// check if cart exists
	// send response

	cartLog("Received request to get cart");

	// get user from req.user
	const user = req.user;

	// check if cart exists
	cartLog("Checking if cart exists");
	const cart = await Cart.findOne({ user: user._id }).populate({
		path: "products.product",
		select: "-createdAt -updatedAt -__v",
	});

	if (!cart) {
		error("Cart not found");
		throw new ApiError("Cart not found", 404);
	} else if (cart.products.length === 0) {
		cartLog("Your cart is empty right now");
		return res
			.status(200)
			.json(new ApiResponse(200, cart, "Your cart is empty right now"));
	}

	cartLog("Cart retrieved successfully");
	return res.status(200).json(new ApiResponse(200, cart, "Cart found"));
});

const deleteCart = asyncHandler(async (req, res) => {
	// Delete cart logic
	// get user from req.user
	// remove cart from user
	// check if cart exists
	// delete cart
	// send response

	cartLog("Received request to delete cart");

	// get user from req.user
	const user = req.user;

	// remove cart from user
	cartLog("Removing cart from user");
	await User.findByIdAndUpdate(user._id, { cart: [] }, { new: true });

	cartLog("Checking if cart exists");
	const isCartDeleted = await Cart.findOneAndDelete({ user: user._id });

	if (isCartDeleted === null) {
		error("Cart not found");
		throw new ApiError("Cart not found", 404);
	}

	cartLog("Cart deleted successfully");
	return res.status(200).json(new ApiResponse(200, null, "Cart deleted"));
});

const removeProductFromCart = asyncHandler(async (req, res) => {
	// Remove product from cart logic
	// get product id from req.params
	// get user from req.user
	// check if cart exists
	// remove product from cart
	// send response

	cartLog("Received request to remove product from cart");
	const { id } = req.params;
	const user = req.user;

	cartLog("Validating product id....");
	if (!mongoose.isValidObjectId(id)) {
		error("Invalid product id");
		throw new ApiError("Invalid product id", 400);
	}

	cartLog("Checking if cart exists");
	const cart = await Cart.findOne({ user: user._id }).populate({
		path: "products.product",
		select: "stock",
	});

	if (!cart) {
		error("Cart not found");
		throw new ApiError("Cart not found", 404);
	}

	cartLog("Removing product from cart having id: " + id);
	const productIndex = cart.products.findIndex(
		(item) => item.product._id.toString() === id
	);

	cartLog("Removing product from cart having index: " + productIndex);

	if (productIndex === -1) {
		error("Product not found in cart");
		throw new ApiError("Product not found in cart", 404);
	}

	cartLog("Restoring stock");
	const productToBeDeleted = cart.products[productIndex];

	console.log("Product to be deleted: ", productToBeDeleted);

	await Product.findByIdAndUpdate(
		productToBeDeleted.product,
		{
			stock: productToBeDeleted.product.stock + productToBeDeleted.quantity,
		},
		{ new: true }
	);

	cart.products.splice(productIndex, 1);
	await cart.save();

	cartLog("Product removed from cart successfully");
	return res
		.status(200)
		.json(new ApiResponse(200, cart, "Product removed from cart"));
});

const updateProductQuantity = asyncHandler(async (req, res) => {
	// Update product quantity logic
	// get product id from req.params
	// get user from req.user
	// get quantity from req.body
	// check if cart exists
	// update product quantity
	// send response

	cartLog("Received request to update product quantity");

	// get product id from req.params
	const { id } = req.params;
	const user = req.user;

	if (!mongoose.isValidObjectId(id)) {
		error("Cart creation failed: Invalid product id");
		throw new ApiError("Invalid product id", 400);
	}

	// get quantity from req.body
	const { quantity } = req.body;

	if (quantity <= 0) {
		error("Cart creation failed: Quantity must be greater than 0");
		throw new ApiError("Quantity must be greater than 0", 400);
	}

	if (quantity === undefined || isNaN(Number(quantity))) {
		throw new ApiError("Invalid or missing quantity", 400);
	}

	cartLog("Received quantity: " + quantity);

	// check if cart exists
	cartLog("Checking if cart exists");
	const cart = await Cart.findOne({ user: user._id }).populate({
		path: "products.product",
		select: "name stock price image discount",
	});

	console.log(cart.products);

	if (!cart) {
		error("Cart not found");
		throw new ApiError("Cart not found", 404);
	}

	cartLog("Checking if product exists in cart....");
	const productIndex = cart.products.findIndex(
		(item) => item.product._id.toString() === id
	);

	if (productIndex === -1) {
		error("Product not found in cart");
		throw new ApiError("Product not found in cart", 404);
	}

	const product = cart.products[productIndex];

	cartLog("Checking if quantity exceeds stock");
	const productExists = await Product.findById(id);

	if (product.quantity === Number(quantity)) {
		cartLog("No changes needed, quantity is the same");
		return res.status(200).json(new ApiResponse(200, cart, "No changes made"));
	}

	// update product quantity
	cartLog("Updating product quantity");
	const quantityDifference = Number(quantity) - product.quantity;

	if (quantityDifference > 0 && productExists.stock < quantityDifference) {
		error("Product update failed: Quantity exceeds stock");
		error("Available Stock: " + productExists.stock + " Quantity: " + quantity);
		throw new ApiError("Quantity exceeds stock", 400);
	}

	productExists.stock -= quantityDifference;
	await productExists.save();

	product.quantity = quantity;
	await cart.save();

	await cart.populate({
		path: "products.product",
		select: "name stock price image discount",
	});

	cartLog("Product quantity updated successfully");
	return res
		.status(200)
		.json(new ApiResponse(200, cart, "Product quantity updated"));
});

const clearCart = asyncHandler(async (req, res) => {
	// Clear cart logic
	// get user from req.user
	// check if cart exists
	// restore stock
	// clear cart
	// send response

	cartLog("Received request to clear cart");
	const user = req.user;

	cartLog("Checking if cart exists");
	const cart = await Cart.findOne({ user: user._id });

	if (!cart) {
		error("Cart not found");
		throw new ApiError("Cart not found", 404);
	} else if (cart.products.length === 0) {
		error("Cart is already empty");
		return res
			.status(200)
			.json(new ApiResponse(200, null, "Cart is already empty"));
	}

	cartLog("Restoring stock....");
	await Product.bulkWrite(
		cart.products.map((item) => ({
			updateOne: {
				filter: { _id: item.product },
				update: {
					$inc: { stock: item.quantity },
				},
			},
		}))
	);

	cartLog("Clearing cart....");
	cart.products = [];
	await cart.save();

	cartLog("Cart cleared successfully");
	return res
		.status(200)
		.json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

export {
	addProductToCart,
	getCart,
	deleteCart,
	removeProductFromCart,
	updateProductQuantity,
	clearCart,
};
