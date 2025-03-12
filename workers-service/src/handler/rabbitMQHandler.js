"use strict";

import { BaseErrorResponse } from "../config/baseResponse";
import rabbitMQ from "../config/rabbitMQ";
import logger from "../config/winston";

const rabbitMQHandler = {
  updateQuantityTicket: async (ticketId, soldQuantity, operation) => {
    try {
      await rabbitMQ.sendMessage("update_tickets_queue", {
        ticketId,
        soldQuantity,
        operation
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: "Error sending delete tickets request",
      });
    }
  }
};

export default rabbitMQHandler;
