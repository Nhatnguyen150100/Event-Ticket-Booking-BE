"use strict";

import paymentService from "../services/paymentService";

const paymentController = {
  createBooking: async (req, res) => {
    try {
      const {
        vnp_OrderInfo,
        vnp_TransactionStatus,
        ticketId,
        secretToken,
        quantity,
        vnp_Amount
      } = req.query;
      if (vnp_TransactionStatus === "00") {
        await paymentService.createBooking(
          vnp_OrderInfo,
          ticketId,
          quantity,
          secretToken,
          vnp_Amount
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
