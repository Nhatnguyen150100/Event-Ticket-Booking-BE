"use strict";

import { BaseErrorResponse } from "../config/baseResponse";
import rabbitMQ from "../config/rabbitMQ";
import logger from "../config/winston";

const rabbitMQHandler = {
  getEventDetail: (eventId) => {
    return new Promise(async (resolve, reject) => {
      const queue = "event_detail_request_queue";
      const responseQueue = "event_detail_response_queue";
      try {
        await rabbitMQ.send({
          queue,
          message: eventId,
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
};

export default rabbitMQHandler;
