"use strict";

import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import logger from "../config/winston";
import rabbitMQ from "../config/rabbitMQ";

const rabbitMQHandler = {
  sendDeleteTicketsRequest: async (eventId) => {
    try {
      await rabbitMQ.send("delete_tickets_queue", eventId);
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: "Error sending delete tickets request",
      });
    }
  },

  getTicketsByEventId: async (eventId) => {
    const queue = "ticket_request_queue";
    const responseQueue = "ticket_response_queue";
    const correlationId = generateUuid();

    try {
      await rabbitMQ.send(queue, eventId, {
        correlationId,
        replyTo: responseQueue,
      });

      await rabbitMQ.receive(responseQueue, (response, properties) => {
        if (properties.correlationId !== correlationId) {
          logger.error("Invalid correlationId");
          return Promise.reject(
            new BaseErrorResponse({ message: "Invalid correlationId" }),
          );
        }

        if (response.status === 200) {
          return Promise.resolve(
            new BaseSuccessResponse({ data: response.data }),
          );
        } else {
          return Promise.reject(
            new BaseErrorResponse({ message: response.message }),
          );
        }
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: "Error getting tickets request",
      });
    }
  },
};

export default rabbitMQHandler;
