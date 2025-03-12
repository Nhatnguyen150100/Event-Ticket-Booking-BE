"use strict";

import rabbitMQ from "../config/rabbitMQ";
import paymentService from "../services/paymentService";

const rabbitMQListener = () => {
  rabbitMQ.on("create_payment_booking", async (message, properties) => {
    const { userId, ticketId, quantity, amount } = message;

    const payment = await paymentService.createPayment(userId, {
      ticketId,
      quantity,
      amount,
    });

    const { correlationId, replyTo } = properties;

    await rabbitMQ.sendMessage(replyTo, payment, {
      correlationId,
    });
  });
  rabbitMQ.on("refund_payment_request_queue", async (message, properties) => {
    const { userId, booking } = message;

    const payment = await paymentService.refundPayment({
      userId,
      booking,
    });

    const { correlationId, replyTo } = properties;

    await rabbitMQ.sendMessage(replyTo, payment, {
      correlationId,
    });
  });
};

export default rabbitMQListener;
