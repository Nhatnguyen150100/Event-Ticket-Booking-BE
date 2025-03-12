"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware.js";
import bookingController from "../controllers/bookingController.js";
const bookingRouters = express.Router();

bookingRouters.get(
  "/",
  tokenMiddleware.verifyToken,
  bookingController.getListBookingByUserId,
);

bookingRouters.get(
  "/:id",
  tokenMiddleware.verifyToken,
  bookingController.getBookingDetail,
);

bookingRouters.post(
  "/",
  tokenMiddleware.verifyToken,
  bookingController.createBooking,
);

bookingRouters.delete(
  "/:id",
  tokenMiddleware.verifyToken,
  bookingController.cancelBooking,
);

export default bookingRouters;
