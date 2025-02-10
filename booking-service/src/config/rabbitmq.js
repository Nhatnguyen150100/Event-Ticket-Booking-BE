"use strict";
import { config } from "dotenv";
import logger from "./winston";
import generateUuid from "../utils/generate-uuid";
import { BaseErrorResponse } from "./baseResponse";
config();

const amqp = require("amqplib");

class RabbitMQ {
  constructor(url = "amqp://localhost") {
    this.url = url;
    this.connection = null;
    this.channel = null;
    this.consumerTags = {};
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

  async sendMessage(queue, message, options) {
    await this.connect();
    await this.channel.assertQueue(queue);
    logger.info(`Sent to ${queue}`);
    this.channel.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(message)),
      options,
    );
  }

  async sendRequestToQueue(queue, message, responseQueue, correlationId) {
    await this.sendMessage(queue, message, {
      replyTo: responseQueue,
      correlationId: correlationId,
    });
  }

  async send({queue, message, responseQueue, resolve, reject}) {
    const uuid = generateUuid();
    await this.off(responseQueue);

    await this.sendRequestToQueue(queue, message, responseQueue, uuid);

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

    this.on(responseQueue, handleResponse);
  }

  async receive(queue, callback) {
    await this.connect();
    await this.channel.assertQueue(queue);

    if (!this.consumerTags[queue]) {
      const listener = (msg) => {
        if (msg !== null) {
          const response = JSON.parse(msg.content.toString());
          logger.info(`Received from ${queue}:`, response);
          callback(response, msg.properties);
          this.channel.ack(msg);
          // this.connection.close();
        }
      };

      const consumerTag = await this.channel.consume(queue, listener, {
        noAck: false,
      });
      this.consumerTags[queue] = consumerTag.consumerTag;
      logger.info(
        `Consumer added for ${queue} with tag: ${consumerTag.consumerTag}`,
      );
    } else {
      logger.warn(`Consumer already exists for ${queue}`);
    }
  }

  async off(queue) {
    if (this.consumerTags[queue]) {
      await this.channel.cancel(this.consumerTags[queue]);
      delete this.consumerTags[queue];
      logger.info(`Listener removed from ${queue}`);
    }
  }

  on(queue, callback) {
    this.receive(queue, callback);
    logger.info(`Listener added to ${queue}`);
  }
}

const rabbitMQ = new RabbitMQ(process.env.RABBITMQ_URL);

export default rabbitMQ;
