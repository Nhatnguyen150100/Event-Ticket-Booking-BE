import logger from "../config/winston";
import rabbitMQHandler from "../handler/rabbitMQHandler";
import { Outbox } from "../models/outbox";

const processOutbox = async () => {
  try {
    const messages = await Outbox.find({ status: "PENDING" })
      .sort({ createdAt: 1 })
      .limit(100);

    for (const msg of messages) {
      try {
        await rabbitMQHandler.updateQuantityTicket(
          msg.payload.ticketId,
          msg.payload.quantity,
          msg.payload.operation,
        );

        msg.status = "PROCESSED";
        msg.processedAt = new Date();
        await msg.save();
      } catch (err) {
        logger.error(`Outbox processing failed: ${err.message}`);
        
        msg.retries += 1;
        if (msg.retries > 5) {
          msg.status = "FAILED";
          msg.errorMessage = err.message;
        }
        await msg.save();
      }
    }
  } catch (error) {
    logger.error(`Outbox processor error: ${error.message}`);
  }
};

const workers = () => {
  const process = async () => {
    await processOutbox();
    setTimeout(process, 5000);
  };
  
  process();
};

export default workers;