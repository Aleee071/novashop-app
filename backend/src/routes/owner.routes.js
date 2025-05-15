import { Router } from "express";
import verifyjwt from "../middlewares/verifyjwt.middleware.js";
import {
	createOwner,
	loginOwner,
	getOwnerDetails,
	updateOwnerDetails,
	changePassword,
	logoutOwner,
	deleteOwner,
	refreshToken,
} from "../controllers/owner.controller.js";

const ownerRouter = Router();

ownerRouter.route("/create").post(createOwner);
ownerRouter.route("/login").post(loginOwner);

// Protected routes
ownerRouter.route("/details").get(verifyjwt, getOwnerDetails);
ownerRouter.route("/update").post(verifyjwt, updateOwnerDetails);
ownerRouter.route("/change-password").post(verifyjwt, changePassword);
ownerRouter.route("/logout").post(verifyjwt, logoutOwner);
ownerRouter.route("/delete").delete(verifyjwt, deleteOwner);
ownerRouter.route("/refresh-token").post(refreshToken);

export default ownerRouter;
