"use strict";

import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import rabbitMQ from "../config/rabbitMQ";
import logger from "../config/winston";
import generateUuid from "../utils/generate-uuid";

const rabbitMQHandler = {
  getTicketFromTicketId: async (ticketId) => {
    const queue = "ticket_detail_request_queue";
    const responseQueue = "ticket_detail_response_queue";

    try {
      await rabbitMQ.send(queue, ticketId, {
        replyTo: responseQueue,
      });

      const responsePromise = new Promise((resolve, reject) => {
        rabbitMQ.receive(responseQueue, (response) => {

          if (response.status === 200) {
            return resolve(new BaseSuccessResponse({ data: response.data }));
          } else {
            return reject(new BaseErrorResponse({ message: response.message }));
          }
        });
      });

      return await responsePromise;
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: "Error sending",
      });
    }
  },
};

export default rabbitMQHandler;
