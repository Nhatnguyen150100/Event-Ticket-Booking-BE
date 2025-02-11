"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware.js";
const paymentRouters = express.Router();

paymentRouters.post(
  "/",
  tokenMiddleware.verifyToken,
  paymentController.createPayment
);

export default paymentRouters;
