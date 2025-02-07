"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware.js";
import bookingController from "../controllers/bookingController.js";
const bookingRouters = express.Router();

bookingRouters.post(
  "/",
  tokenMiddleware.verifyTokenAdmin,
  bookingController.createBooking,
);

export default bookingRouters;
