"use strict";
import express from "express";
import paymentController from "../controllers/paymentController.js";
const paymentRouters = express.Router();

paymentRouters.get("/create-booking", paymentController.createBooking);

export default paymentRouters;
