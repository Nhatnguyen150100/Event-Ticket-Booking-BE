"use strict";

import { BaseErrorResponse } from "../config/baseResponse";
import rabbitMQ from "../config/rabbitMQ";
import logger from "../config/winston";

const rabbitMQHandler = {
  sendDeleteTicketsRequest: async (eventId) => {
    try {
      await rabbitMQ.send({queue: "delete_tickets_queue", message: eventId});
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: "Error sending delete tickets request",
      });
    }
  },

  getTicketsByEventId: async (eventId) => {
    return new Promise(async (resolve, reject) => {
      const queue = "ticket_request_queue";
      const responseQueue = "ticket_response_queue";
  
      try {
        await rabbitMQ.send({queue, message: eventId, responseQueue, resolve, reject});
      } catch (error) {
        logger.error(error.message);
        return new BaseErrorResponse({
          message: "Error getting tickets request",
        });
      }
    });
    
  },
};

export default rabbitMQHandler;
