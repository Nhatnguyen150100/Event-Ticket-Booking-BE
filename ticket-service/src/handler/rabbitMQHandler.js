"use strict";

import { BaseErrorResponse } from "../config/baseResponse";
import rabbitMQ from "../config/rabbitMQ";
import logger from "../config/winston";
import generateUuid from "../utils/generate-uuid";

const rabbitMQHandler = {
  getEventDetail: (eventId) => {
    return new Promise(async (resolve, reject) => {
      const queue = "event_detail_request_queue";
      const responseQueue = "event_detail_response_queue";
      const uuid = generateUuid();
      await rabbitMQ.off(responseQueue);
      try {
        await rabbitMQ.send(queue, eventId, {
          replyTo: responseQueue,
          correlationId: uuid,
        });
        const timeout = setTimeout(() => {
          reject(
            new BaseErrorResponse({
              message: "Timeout while waiting for response",
            }),
          );
        }, 5000);

        const handleResponse = (response, properties) => {
          if (properties.correlationId === uuid) {
            clearTimeout(timeout);

            if (response.status === 200) {
              resolve(response);
            } else {
              reject(response);
            }
          }
        };

        rabbitMQ.on(responseQueue, handleResponse);
      } catch (error) {
        logger.error(error.message);
        return new BaseErrorResponse({
          message: "Error sending",
        });
      }
    });
  },
};

export default rabbitMQHandler;
