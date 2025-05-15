import mongoose, { model } from "mongoose";

const orderSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: [true, "User is required"],
	},
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			quantity: { type: Number, required: true, min: 1 },
			owner: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Owner",
				required: true,
			},
		},
	],
	totalPrice: {
		type: Number,
		required: [true, "Total price is required"],
	},
	status: {
		type: String,
		enum: ["Pending", "Shipped", "Delivered"],
		default: "Pending",
	},
	shippingAddress: {
		type: String,
		required: [true, "Shipping address is required"],
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const Order = model("Order", orderSchema);
