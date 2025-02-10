"use strict";

import { BaseErrorResponse } from "../config/baseResponse";
import rabbitMQ from "../config/rabbitMQ";
import logger from "../config/winston";

const rabbitMQHandler = {
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
  updateQuantityTicket: async (ticketId, soldQuantity) => {
    try {
      await rabbitMQ.send({queue: "update_tickets_queue", message: {
        ticketId,
        soldQuantity
      }});
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: "Error sending delete tickets request",
      });
    }
  }
};

export default rabbitMQHandler;
