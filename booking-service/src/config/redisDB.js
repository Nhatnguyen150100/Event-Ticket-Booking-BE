"use strict";
import { config } from "dotenv";
import logger from "./winston";
import generateUuid from "../utils/generate-uuid";
import { BaseErrorResponse } from "./baseResponse";
import { createClient } from "redis";
config();

class RedisDB {
  constructor(url = "redis://localhost:6379") {
    this.url = url;
    this.client = null;
    this.subscribers = new Map();
    this.pubSubClient = null;
  }

  async connect() {
    if (!this.client) {
      try {
        this.client = createClient({ url: this.url });
        this.pubSubClient = this.client.duplicate();

        await this.client.connect();
        await this.pubSubClient.connect();

        logger.info("Connected to Redis successfully");
      } catch (error) {
        logger.error("Failed to connect to Redis:", error.message);
        throw error;
      }
    }
  }

  async set(key, value, options = {}) {
    await this.connect();
    try {
      const result = await this.client.set(key, JSON.stringify(value), options);
      logger.info(`Set key: ${key}`);
      return result;
    } catch (error) {
      logger.error(`Error setting key ${key}:`, error.message);
      throw error;
    }
  }

  async get(key) {
    await this.connect();
    try {
      const data = await this.client.get(key);
      logger.info(`Get key: ${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Error getting key ${key}:`, error.message);
      throw error;
    }
  }

  async remove(key) {
    await this.connect();
    try {
      const result = await this.client.del(key);
      logger.info(`Remove key: ${key}`);
      return result;
    } catch (error) {
      logger.error(`Error remove key ${key}:`, error.message);
      throw error;
    }
  }

  async publish(channel, message) {
    await this.connect();
    try {
      await this.client.publish(channel, JSON.stringify(message));
      logger.info(`Published to ${channel}`);
    } catch (error) {
      logger.error(`Error publishing to ${channel}:`, error.message);
      throw error;
    }
  }

  async subscribe(channel, callback) {
    await this.connect();
    try {
      if (!this.subscribers.has(channel)) {
        this.subscribers.set(channel, callback);
        await this.pubSubClient.subscribe(channel, (message) => {
          logger.info(`Received from ${channel}`);
          callback(JSON.parse(message));
        });
        logger.info(`Subscribed to ${channel}`);
      }
    } catch (error) {
      logger.error(`Error subscribing to ${channel}:`, error.message);
      throw error;
    }
  }

  async unsubscribe(channel) {
    await this.connect();
    try {
      if (this.subscribers.has(channel)) {
        await this.pubSubClient.unsubscribe(channel);
        this.subscribers.delete(channel);
        logger.info(`Unsubscribed from ${channel}`);
      }
    } catch (error) {
      logger.error(`Error unsubscribing from ${channel}:`, error.message);
      throw error;
    }
  }

  async send({ channel, message, responseChannel, resolve, reject }) {
    const uuid = generateUuid();
    await this.unsubscribe(responseChannel);

    const timeout = setTimeout(() => {
      reject(
        new BaseErrorResponse({
          message: "Timeout while waiting for response",
        }),
      );
    }, 5000);

    const handler = (response) => {
      if (response.correlationId === uuid) {
        clearTimeout(timeout);
        response.status === 200 ? resolve(response) : reject(response);
      }
    };

    await this.subscribe(responseChannel, handler);
    await this.publish(channel, {
      ...message,
      replyChannel: responseChannel,
      correlationId: uuid,
    });
  }
}

const redisDB = new RedisDB(process.env.REDIS_URL);

export default redisDB;
