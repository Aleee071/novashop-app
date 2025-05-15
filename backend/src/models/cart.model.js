import { Schema, model } from "mongoose";
import { error } from "../utils/logger.js";

const cartSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: [true, "User is required"],
	},
	products: [
		{
			product: {
				type: Schema.Types.ObjectId,
				ref: "Product",
				required: true,
			},
			quantity: { type: Number, required: true, min: 1 },
		},
	],
	totalPrice: {
		type: Number,
		default: 0,
	},
});

cartSchema.pre("save", async function (next) {
	try {
		// populate products
		await this.populate("products.product", "price discount");

		this.totalPrice = this.products.reduce(function (total, item) {
			if (!item.product || typeof item.product.price !== "number") {
				error("Invalid item detected:", item.product);
				throw new Error("Invalid product data");
			}

			const discountedPrice =
				item.product.price - item.product.price * (item.product.discount / 100);

			total += discountedPrice * item.quantity;
			return total;
		}, 0);

		next();
	} catch (err) {
		error("Error calculating total price:", err.message);
		next(err);
	}
});

export const Cart = model("Cart", cartSchema);
