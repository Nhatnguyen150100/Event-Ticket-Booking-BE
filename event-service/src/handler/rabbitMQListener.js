
import rabbitMQ from "../config/rabbitMQ";
import eventService from "../services/eventService";

const rabbitMQListener = () => {
  rabbitMQ.on("event_detail_request_queue", async (message, properties) => {
    const eventId = message;
    const event = await eventService.getEventById(eventId);

    const { correlationId, replyTo } = properties;

    await rabbitMQ.sendMessage(replyTo, event, {
      correlationId,
    });
  });
};

export default rabbitMQListener;
