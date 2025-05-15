import { Router } from "express";
import verifyjwt from "../middlewares/verifyjwt.middleware.js";
import {
	registerUser,
	loginUser,
	getUser,
	logoutUser,
	refreshAccessToken,
	changePassword,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
// Protected routes
userRouter.route("/user").get(verifyjwt, getUser);
userRouter.route("/logout").post(verifyjwt, logoutUser);
userRouter.route("/change-password").post(verifyjwt, changePassword);

export default userRouter;
