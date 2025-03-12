"use strict";

import { BaseErrorResponse } from "../config/baseResponse";
import rabbitMQ from "../config/rabbitMQ";
import logger from "../config/winston";

const rabbitMQHandler = {
  createBooking: ({ userId, ticketId, quantity }) => {
    return new Promise(async (resolve, reject) => {
      const queue = "create_booking_request_queue";
      const responseQueue = "create_booking_response_queue";

      try {
        await rabbitMQ.send({
          queue,
          message: { userId, ticketId, quantity },
          responseQueue,
          resolve,
          reject,
        });
      } catch (error) {
        logger.error(error.message);
        return reject(
          new BaseErrorResponse({
            message: "Error sending",
          }),
        );
      }
    });
  },
  getBookingDetails: (bookingId) => {
    return new Promise(async (resolve, reject) => {
      const queue = "get_booking_details_request_queue";
      const responseQueue = "get_booking_details_response_queue";

      try {
        await rabbitMQ.send({
          queue,
          message: { bookingId },
          responseQueue,
          resolve,
          reject,
        });
      } catch (error) {
        logger.error(error.message);
        return reject(
          new BaseErrorResponse({
            message: "Error sending",
          }),
        );
      }
    });
  }
};

export default rabbitMQHandler;
