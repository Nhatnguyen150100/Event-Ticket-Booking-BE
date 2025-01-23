"use strict";
import rabbitMQ from "../config/rabbitMQ";
import ticketsService from "../services/ticketsService";

const rabbitMQListener = () => {
  rabbitMQ.receive("delete_tickets_queue", async (message) => {
    const { ticketIds } = message;
    await ticketsService.deleteListTickets(ticketIds);
  });
};

export default rabbitMQListener;
