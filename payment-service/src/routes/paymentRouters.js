"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware.js";
import paymentController from "../controllers/paymentController.js";
const paymentRouters = express.Router();

paymentRouters.post(
  "/",
  tokenMiddleware.verifyToken,
  paymentController.createPayment
);

paymentRouters.get("/create-booking", paymentController.createBooking);

export default paymentRouters;
