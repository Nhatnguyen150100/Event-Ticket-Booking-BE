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
  getTicketFromTicketId: (ticketId) => {
    return new Promise(async (resolve, reject) => {
      const queue = "ticket_detail_request_queue";
      const responseQueue = "ticket_detail_response_queue";

      try {
        await rabbitMQ.send({queue, message: ticketId, responseQueue, resolve, reject});
      } catch (error) {
        logger.error(error.message);
        return reject(new BaseErrorResponse({
          message: "Error sending",
        }));
      }
    });
  },
};

export default rabbitMQHandler;
