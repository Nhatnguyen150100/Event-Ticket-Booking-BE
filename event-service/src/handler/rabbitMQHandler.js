"use strict";
import { BaseErrorResponse, BaseSuccessResponse } from "../config/baseResponse";
import logger from "../config/winston";

const { default: rabbitMQ } = require("../config/rabbitMQ");

const rabbitMQHandler = {
  sendDeleteTicketsRequest: async (ticketIds) => {
    try {
      await rabbitMQ.send("delete_tickets_queue", { ticketIds }, (response) => {
        if (response.status === "success") {
          return new BaseSuccessResponse({
            data: response,
          });
        } else {
          return new BaseErrorResponse({
            message: "Failed to send delete tickets request",
          });
        }
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: "Error sending delete tickets request",
      });
    }
  },
};

export default rabbitMQHandler;
