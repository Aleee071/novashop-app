import mongoose, { model, Schema } from "mongoose";

const productSchema = new Schema(
	{
		name: {
			type: String,
			unique: true,
			required: [true, "Username is required"],
			trim: true,
			index: true,
		},
		price: {
			type: Number,
			required: [true, "Price is required"],
		},
		stock: {
			type: Number,
			default: 1,
			required: [true, "Stock is required"],
			min: [0, "Stock cannot be negative"],
		},
		description: {
			type: String,
		},
		discount: {
			type: Number,
			default: 0,
		},
		image: {
			type: String,
			required: [true, "Image is required"],
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Owner",
			required: true,
		},
	},
	{ timestamps: true }
);

export const Product = model("Product", productSchema);
