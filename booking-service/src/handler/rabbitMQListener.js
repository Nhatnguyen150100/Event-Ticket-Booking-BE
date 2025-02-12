"use strict";

import rabbitMQ from "../config/rabbitMQ";
import bookingService from "../services/bookingService";

const rabbitMQListener = () => {
  rabbitMQ.on("create_booking_request_queue", async (message, properties) => {
    const { userId, ticketId, quantity } = message;

    const booking = await bookingService.createBooking({
      userId,
      ticketId,
      quantity,
    });

    const { correlationId, replyTo } = properties;

    await rabbitMQ.sendMessage(replyTo, booking, {
      correlationId,
    });
  });
};

export default rabbitMQListener;
