"use strict";
import express from "express";
import authController from "../controllers/auth/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import passportController from "../controllers/auth/passportController.js";
const authRouter = express.Router();

authRouter.post(
  "/login",
  authController.login,
);
authRouter.get("/google", passportController.authenticateByGoogle);
authRouter.get("/google/callback", passportController.authenticateCallback);
authRouter.post(
  "/register",
  authMiddleware.checkUserExist,
  authController.register,
);

export default authRouter;
