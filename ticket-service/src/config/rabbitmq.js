"use strict";
import { config } from "dotenv";
import logger from "./winston";
config();

const amqp = require("amqplib");

class RabbitMQ {
  constructor(url = "amqp://localhost") {
    this.url = url;
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (!this.connection) {
      try {
        this.connection = await amqp.connect(this.url);
        this.channel = await this.connection.createChannel();
        logger.info("Connected to RabbitMQ successfully");
      } catch (error) {
        logger.error("Failed to connect to RabbitMQ:", error.message);
        throw error;
      }
    }
  }

  async send(queue, message, options) {
    await this.connect();
    await this.channel.assertQueue(queue);
    logger.info(`Sent to ${queue}`);
    this.channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      options,
    );
  }

  async receive(queue, callback) {
    try {
      await this.connect();
      await this.channel.assertQueue(queue);

      this.channel.consume(queue, (msg) => {
        const response = JSON.parse(msg.content.toString());
        logger.info(`Received from ${queue}:`, response);
        callback(response, msg.properties);
        this.channel.ack(msg);
      });
    } catch (error) {
      logger.error(error.message);
    }
  }
}

const rabbitMQ = new RabbitMQ(process.env.RABBITMQ_URL);

export default rabbitMQ;
