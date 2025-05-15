import { Product } from "../models/product.model.js";
import { Owner } from "../models/owner.model.js";
import { error, product } from "../utils/logger.js";
import { deleteImageIfExists } from "../utils/deleteImageIfExists.js";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const createProduct = asyncHandler(async (req, res) => {
	// Create product logic
	// get data from req.body
	// get image from req.file
	// validate data
	// check if product already exists
	// create product
	// push product to owner model
	// send response

	try {
		product("Received request to create product");
		const { name, price, description, stock, discount } = req.body;

		const image = req.file?.filename || "";

		// validate data
		product("Validating data");

		if (
			[name, price, stock, discount, image].some(
				(field) => field?.trim() === ""
			)
		) {
			error("Product creation failed: All fields are required");

			await deleteImageIfExists(image);
			throw new ApiError("All fields are required", 400);
		}

		// check if product already exists
		product("Checking if product already exists");
		const existingProduct = await Product.findOne({ name });

		if (existingProduct) {
			error("Product creation failed: Product already exists");
			deleteImageIfExists(image);
			throw new ApiError("Product already exists", 400);
		}

		// create product
		product("Creating product....");

		const newProduct = await Product.create({
			name,
			price,
			description,
			stock,
			discount,
			image,
			owner: req.user._id,
		});

		if (!newProduct) {
			error("Product creation failed: Product not created");
			deleteImageIfExists(image);
			throw new ApiError("Product not created", 400);
		}

		// push product to owner model
		await Owner.findByIdAndUpdate(
			req.user._id,
			{
				$push: {
					productsOwned: newProduct._id,
				},
			},
			{ new: true }
		);

		// send response
		product("Product created successfully");

		return res
			.status(201)
			.json(new ApiResponse(201, newProduct, "Product created"));
	} catch (err) {
		error("Unexpected error during product creation:", err.message);
		throw new ApiError("Internal Server Error", 500);
	}
});

const deleteProduct = asyncHandler(async (req, res) => {
	// Delete product logic
	// get id from req.params
	// check if product exists
	// remove product from owner document
	// delete product
	// send response

	try {
		product("Received request to delete product");
		const { id } = req.params;

		product("Validating product id....");
		if (!mongoose.isValidObjectId(id)) {
			error("Product deletion failed: Invalid product id");
			throw new ApiError("Invalid product id", 400);
		}

		// check if product exists
		product("Checking if product exists");
		const productToDelete = await Product.findById(id);

		if (!productToDelete) {
			error("Product deletion failed: Product not found");
			throw new ApiError("Product not found", 404);
		}

		// remove product from owner document
		product("removing product from owner model....");
		await Owner.findByIdAndUpdate(
			req.user._id,
			{
				$pull: { productsOwned: productToDelete._id },
			},
			{ new: true }
		);

		// delete product
		product("Deleting product....");
		await deleteImageIfExists(productToDelete?.image);
		await Product.deleteOne({ _id: id });

		// send response
		product("Product deleted successfully");
		return res.status(200).json(new ApiResponse(200, null, "Product deleted"));
	} catch (err) {
		error("Unexpected error during product deletion:", err);
		throw new ApiError("Internal Server Error", 500);
	}
});

const getAllProducts = asyncHandler(async (_, res) => {
	// Get all products logic
	// get all products
	// send response

	product("Received request to get all products");
	const products = await Product.find().populate("owner", "fullname email");

	product("Retrieving products....");
	if (!products && products?.length === 0) {
		error("Products retrieval failed: Products not found");
		throw new ApiError("Products not found", 404);
	}

	product("Products retrieved successfully");

	return res.status(200).json(new ApiResponse(200, products, "Products found"));
});

const updateProduct = asyncHandler(async (req, res) => {
	// update product logic
	// get product id through params
	// get product data from req.body
	// check if products exists
	// update product
	// send response

	product("Received request to update product");
	const { id } = req.params;

	product("Validating product id....");
	if (!mongoose.isValidObjectId(id)) {
		await deleteImageIfExists(req.file?.filename);

		error("Product update failed: Invalid product id");
		throw new ApiError("Invalid product id", 400);
	}

	product("Checking if product exists");
	const productExists = await Product.findById(id);

	if (!productExists) {
		await deleteImageIfExists(req.file?.filename);

		error("Product update failed: Product not found");
		throw new ApiError("Product not found", 404);
	}

	if (productExists.owner.toString() !== req.user._id.toString()) {
		error("Product update failed: Unauthorized");
		throw new ApiError("You are not authorized to update this product", 401);
	}

	product("Validating product data");
	const { name, price, description, stock, discount } = req.body;
	const newImage = req.file?.filename || "";

	if (
		[name, price, stock, description, discount].some(
			(field) => field?.trim() === ""
		)
	) {
		await deleteImageIfExists(newImage);

		error("Product update failed: All fields are required");
		throw new ApiError("All fields are required", 400);
	}

	const updatedImage = newImage || productExists?.image;

	if (newImage.length > 0 && productExists?.image === "") {
		await deleteImageIfExists(productExists.image);
	}

	product("Updating product");
	const productToUpdate = await Product.findByIdAndUpdate(
		id,
		{ name, price, description, stock, discount, image: updatedImage },
		{ new: true }
	).populate({
		path: "owner",
		select: "email fullname _id",
	});

	if (!productToUpdate) {
		await deleteImageIfExists(productExists?.image);
		await deleteImageIfExists(newImage);
		error("Product update failed: Product not updated");
		throw new ApiError("Product not updated", 400);
	}

	product("Product updated successfully");
	return res
		.status(200)
		.json(new ApiResponse(200, productToUpdate, "Product updated"));
});

const getProduct = asyncHandler(async (req, res) => {
	// Get product logic
	// get product id from req.params
	// check if product exists
	// send response

	product("Received request to get product");

	const { id } = req.params;

	product("Validating product id....");
	if (!mongoose.isValidObjectId(id)) {
		error("Product retrieval failed: Invalid product id");
		throw new ApiError("Invalid product id", 400);
	}

	product("Checking if product exists");
	const productExists = await Product.findById(id).populate(
		"owner",
		"fullname email productsOwned"
	);

	if (!productExists) {
		error("Product retrieval failed: Product not found");
		throw new ApiError("Product not found", 404);
	}

	product("Product retrieved successfully");
	return res
		.status(200)
		.json(new ApiResponse(200, productExists, "Product found"));
});

const getProductsByOwner = asyncHandler(async (req, res) => {
	// Get products by owner logic
	// get owner from req.user
	// get products by owner
	// send response

	product("Received request to get products by owner");
	const ownerId = req.user;

	product("Checking if products exist");
	const existingProducts = await Product.find({
		owner: ownerId,
	}).select("-__v -createdAt -updatedAt");

	if (!existingProducts) {
		error("Product retrieval failed: Products not found");
		throw new ApiError("Products not found", 404);
	}

	product("Products retrieved successfully");

	return res
		.status(200)
		.json(new ApiResponse(200, existingProducts, "Products found"));
});

export {
	createProduct,
	deleteProduct,
	getAllProducts,
	updateProduct,
	getProduct,
	getProductsByOwner,
};
