"use strict";
import express from "express";
import eventController from "../controllers/eventController.js";
import tokenMiddleware from "../middleware/tokenMiddleware.js";
const eventRouters = express.Router();

eventRouters.get(
  "/",
  tokenMiddleware.verifyToken,
  eventController.getAllEvents,
);

eventRouters.post(
  "/",
  tokenMiddleware.verifyTokenAdmin,
  eventController.createEvent,
);
eventRouters.get(
  "/:id",
  tokenMiddleware.verifyToken,
  eventController.getEventById,
);
eventRouters.put(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  eventController.updateEvent,
);

eventRouters.delete(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  eventController.deleteEvent,
);

export default eventRouters;
