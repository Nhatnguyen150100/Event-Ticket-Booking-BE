"use strict";
import rabbitMQ from "../config/rabbitMQ";
import ticketsService from "../services/ticketsService";

const rabbitMQListener = () => {
  rabbitMQ.on("delete_tickets_queue", async (message) => {
    const eventId = message;
    await ticketsService.deleteListTickets(eventId);
  });
  rabbitMQ.on("update_tickets_queue", async (message) => {
    const { eventId, soldQuantity } = message;
    await ticketsService.updateSoldQuantityTicket(eventId, soldQuantity);
  });
  rabbitMQ.on("ticket_request_queue", async (message, properties) => {
    const eventId = message;
    const tickets = await ticketsService.getAllTicketFromEvent({ eventId });

    const { correlationId, replyTo } = properties;

    await rabbitMQ.sendMessage(replyTo, tickets, {
      correlationId,
    });
  });
  rabbitMQ.on("ticket_detail_request_queue", async (message, properties) => {
    const ticketId = message;
    const ticket = await ticketsService.getTicketById(ticketId);

    const { correlationId, replyTo } = properties;

    await rabbitMQ.sendMessage(replyTo, ticket, {
      correlationId,
    });
  });
};

export default rabbitMQListener;
