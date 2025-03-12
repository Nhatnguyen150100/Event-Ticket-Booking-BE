"use strict";

import { BaseErrorResponse } from "../config/baseResponse";
import rabbitMQ from "../config/rabbitMQ";
import logger from "../config/winston";

const rabbitMQHandler = {
  createPaymentBooking: ({ userId, ticketId, quantity, amount }) => {
    return new Promise(async (resolve, reject) => {
      const queue = "create_payment_booking";
      const responseQueue = "create_payment_booking_response";

      try {
        await rabbitMQ.send({
          queue,
          message: {
            userId,
            ticketId,
            quantity,
            amount,
          },
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
      const responseQueue = "ticket_detail_response_queue_from_booking_service";

      try {
        await rabbitMQ.send({
          queue,
          message: ticketId,
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
  refundPayment: ({
    userId,
    booking,
  }) => {
    return new Promise(async (resolve, reject) => {
      const queue = "refund_payment_request_queue";
      const responseQueue = "refund_payment_response_queue";

      try {
        await rabbitMQ.send({
          queue,
          message: {
            userId,
            booking,
          },
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
