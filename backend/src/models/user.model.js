import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
	fullname: {
		type: String,
		required: [true, "Fullname is required"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Email is required"],
		trim: true,
		lowercase: true, // Fixed issue
	},
	password: {
		type: String,
		required: [true, "Password is required"],
	},
	username: {
		type: String,
		unique: true,
		required: [true, "Username is required"],
		trim: true,
		lowercase: true, // Fixed issue
		index: true,
	},
	avatar: {
		type: String,
	},
	orders: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Order",
		},
	],
	cart: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Cart",
		},
	],
	contact: {
		type: String, // Changed from Number to String
		required: [true, "Contact is required"],
		unique: true,
	},
	refreshToken: {
		type: String,
	},
	role: {
		type: String,
		default: "user",
		enum: ["user", "owner"],
		required: [true, "Role is required"],
	},
});

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}

	if (this.isModified("refreshToken") && this.refreshToken) {
		this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
	}

	next();
});

userSchema.methods.isValidPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

userSchema.methods.isValidRefreshToken = async function (refreshToken) {
	return await bcrypt.compare(refreshToken, this.refreshToken);
};

export const User = model("User", userSchema);
