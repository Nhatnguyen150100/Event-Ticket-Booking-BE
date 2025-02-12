"use strict";

import paymentService from "../services/paymentService";

const paymentController = {
  createPayment: async (req, res) => {
    try {
      const { id } = req.user;
      const result = await paymentService.createPayment(id, req.body);
      res.status(result.status).json(result);
    } catch (error) {
      res.status(error.status).json(error);
    }
  },
  createBooking: async (req, res) => {
    try {
      const {
        vnp_OrderInfo,
        vnp_TransactionStatus,
        ticketId,
        secretToken,
        quantity,
      } = req.query;
      if (vnp_TransactionStatus === "00") {
        await paymentService.createBooking(
          vnp_OrderInfo,
          ticketId,
          quantity,
          secretToken,
        );
        res.redirect(`${process.env.BASE_URL_CLIENT}/payment-success`);
      } else {
        res.redirect(`${process.env.BASE_URL_CLIENT}/payment-error`);
      }
    } catch (error) {
      res.status(error.status).json(error.message);
    }
  },
};

export default paymentController;
