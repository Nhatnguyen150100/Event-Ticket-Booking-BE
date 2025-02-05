"use strict";
import rabbitMQ from "../config/rabbitMQ";
import ticketsService from "../services/ticketsService";

const rabbitMQListener = () => {
  rabbitMQ.receive("delete_tickets_queue", async (message) => {
    const { eventId } = message;
    await ticketsService.deleteListTickets(eventId);
  });
  rabbitMQ.receive("ticket_request_queue", async (message, properties) => {
    const eventId = message;
    const tickets = await ticketsService.getAllTicketFromEvent({eventId});

    const { correlationId, replyTo } = properties;

    await rabbitMQ.send(replyTo, tickets, {
      correlationId,
    });
  });
};

export default rabbitMQListener;
