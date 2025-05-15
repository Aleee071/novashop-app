import mongoose, { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const ownerSchema = new Schema({
	fullname: {
		type: String,
		required: [true, "Fullname is required"],
	},
	email: {
		type: String,
		unique: true,
		required: [true, "Email is required"],
		trim: true,
		lowercase: true,
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
		lowercase: true,
		index: true,
	},
	avatar: {
		type: String,
	},
	productsOwned: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
		},
	],
	contact: {
		type: String,
		required: [true, "Contact is required"],
	},
	refreshToken: {
		type: String,
	},
	role: {
		type: String,
		default: "owner",
		enum: ["owner"],
		required: [true, "Role is required"],
	},
});

ownerSchema.pre("save", async function (next) {
	if (this.password && this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 10);
	}

	if (this.refreshToken && this.isModified("refreshToken")) {
		this.refreshToken = await bcrypt.hash(this.refreshToken, 10);
	}

	next();
});

ownerSchema.methods.isValidPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

ownerSchema.methods.isValidRefreshToken = async function (refreshToken) {
	return await bcrypt.compare(refreshToken, this.refreshToken);
};

export const Owner = model("Owner", ownerSchema);
