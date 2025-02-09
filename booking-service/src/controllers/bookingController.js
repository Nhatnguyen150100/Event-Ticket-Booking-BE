"use strict";

import bookingService from "../services/bookingService";


const bookingController = {
  createBooking: async (req, res) => {
    try {
      const user = req.user;
      console.log("🚀 ~ createBooking: ~ user:", user)
      const result = await bookingService.createBooking({userId: user.id, ...req.body});
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  // getTicketById: async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const result = await ticketsService.getTicketById(id);
  //     res.status(result.status).json(result);
  //   } catch (error) {
  //     res.status(error.status).json(error);
  //   }
  // },
  // updateTicket: async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const result = await ticketsService.updateTicket(id, req.body);
  //     res.status(result.status).json(result);
  //   } catch (error) {
  //     res.status(error.status).json(error);
  //   }
  // },
  // deleteTicket: async (req, res) => {
  //   const { id } = req.params;
  //   try {
  //     const result = await ticketsService.deleteTicket(id);
  //     res.status(result.status).json(result);
  //   } catch (error) {
  //     res.status(error.status).json(error);
  //   }
  // },
  // getAllTicketFromEvent: async (req, res) => {
  //   try {
  //     const result = await ticketsService.getAllTicketFromEvent(req.query);
  //     res.status(result.status).json(result);
  //   } catch (error) {
  //     res.status(error.status).json(error);
  //   }
  // },
};

export default bookingController;
