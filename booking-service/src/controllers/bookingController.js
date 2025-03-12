"use strict";

import bookingService from "../services/bookingService";

const bookingController = {
  getListBookingByUserId: async (req, res) => {
    try {
      const user = req.user;
      const result = await bookingService.getListBookingByUserId({
        userId: user.id,
        ...req.query,
      });
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  createBooking: async (req, res) => {
    try {
      const user = req.user;
      const result = await bookingService.createRequestBooking(user.id, req.body);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  getBookingDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await bookingService.getBookingDetail(id);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
};

export default bookingController;
