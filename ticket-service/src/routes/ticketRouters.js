"use strict";
import express from "express";
import tokenMiddleware from "../middleware/tokenMiddleware.js";
import ticketController from "../controllers/ticketController.js";
const ticketRouters = express.Router();

ticketRouters.get(
  "/",
  tokenMiddleware.verifyToken,
  ticketController.getAllTicketFromEvent,
);

ticketRouters.post(
  "/",
  tokenMiddleware.verifyTokenAdmin,
  ticketController.createTicket,
);
ticketRouters.get(
  "/:id",
  tokenMiddleware.verifyToken,
  ticketController.getTicketById,
);
ticketRouters.put(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  ticketController.updateTicket,
);

ticketRouters.delete(
  "/:id",
  tokenMiddleware.verifyTokenAdmin,
  ticketController.deleteTicket,
);

export default ticketRouters;
