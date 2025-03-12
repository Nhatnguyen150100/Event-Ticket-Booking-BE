import logger from "../config/winston";
import rabbitMQHandler from "../handler/rabbitMQHandler";
import { Outbox } from "../models/outbox";

let interval = 5000;

const processOutbox = async () => {
  try {
    const messages = await Outbox.find({ status: "PENDING" })
      .sort({ createdAt: 1 })
      .limit(100);

    for (const msg of messages) {
      try {
        const latency = Date.now() - msg.createdAt.getTime();
        logger.info(`Processing latency: ${latency}ms`);
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

const adjustInterval = (pendingCount) => {
  if (pendingCount > 1000) interval = 1000;
  else if (pendingCount > 500) interval = 2000;
  else interval = 5000;
};

const process = async () => {
  const pendingCount = await Outbox.countDocuments({ status: "PENDING" });
  adjustInterval(pendingCount);
  await processOutbox();
  setTimeout(process, interval);
};

const workers = () => {
  process();
};

export default workers;
