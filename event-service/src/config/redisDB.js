"use strict";
import { config } from "dotenv";
import logger from "./winston";
import { createClient } from "redis";
config();

class RedisDB {
  constructor(url = "redis://localhost:6379") {
    this.url = url;
    this.client = null;
  }

  async connect() {
    if (!this.client) {
      try {
        this.client = createClient({ url: this.url });

        await this.client.connect();

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

  async del(key) {
    await this.connect();
    try {
      const result = await this.client.del(key);
      logger.info(`Remove key: ${key}`);
      return result;
    } catch (error) {
      logger.error(`Error del key ${key}:`, error.message);
      throw error;
    }
  }
  
  async delPattern(pattern) {
    await this.connect();
    let cursor = 0;
    let keys = [];
    do {
      const reply = await this.client.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });
      cursor = reply.cursor;
      keys = keys.concat(reply.keys);
    } while (cursor !== 0);

    if (keys.length > 0) {
      await this.client.del(keys);
    }
    logger.info(`Removed keys with pattern: ${pattern}`);
    return keys.length;
  }
}

const redisDB = new RedisDB(process.env.REDIS_URL);

export default redisDB;
