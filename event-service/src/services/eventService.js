import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseResponse";
import redisDB from "../config/redisDB";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import logger from "../config/winston";
import rabbitMQHandler from "../handler/rabbitMQHandler";
import { Event } from "../models/event";

const eventService = {
  createEvent: async (data) => {
    try {
      const {
        name,
        imageThumbnail,
        startDate,
        endDate,
        startTime,
        endTime,
        type,
        location,
        description,
        capacity,
        contact,
        eventOrganization,
      } = data;
      const newEvent = new Event({
        name,
        imageThumbnail,
        startDate,
        endDate,
        startTime,
        endTime,
        type,
        location,
        description,
        capacity,
        contact,
        eventOrganization,
      });
      const savedEvent = await newEvent.save();
      await redisDB.delPattern(`events:*`);

      return new BaseSuccessResponse({
        data: savedEvent,
        message: "Event created successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error creating event" });
    }
  },
  getEventById: async (id) => {
    try {
      const eventFromCache = await redisDB.get(id);
      if (eventFromCache) {
        return new BaseSuccessResponse({
          data: eventFromCache,
          message: "Event fetched successfully",
        });
      }

      const event = await Event.findById(id);
      if (!event) {
        return new BaseErrorResponse({ message: "Event not found" });
      }

      await redisDB.set(id, event, {
        EX: 60,
      });

      return new BaseSuccessResponse({
        data: event,
        message: "Event fetched successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error fetching event" });
    }
  },
  updateEvent: async (id, data) => {
    try {
      const checkEventCache = await redisDB.get(id);
      if (checkEventCache) {
        await redisDB.del(id);
      }

      const updatedEvent = await Event.findByIdAndUpdate(id, data, {
        new: true,
      });
      await redisDB.delPattern(`events:*`);

      await redisDB.set(id, updatedEvent, {
        EX: 60,
      });

      if (!updatedEvent) {
        return new BaseErrorResponse({ message: "Event not found" });
      }
      return new BaseSuccessResponse({
        data: updatedEvent,
        message: "Event updated successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error updating event" });
    }
  },
  deleteEvent: async (id) => {
    try {
      const checkEventCache = await redisDB.get(id);
      if (checkEventCache) {
        await redisDB.del(id);
      }

      const event = await Event.findById(id);
      if (!event) {
        return new BaseErrorResponse({ message: "Event not found" });
      }

      await rabbitMQHandler.sendDeleteTicketsRequest(event._id);

      await Event.findByIdAndDelete(id);
      
      await redisDB.delPattern(`events:*`);

      return new BaseSuccessResponse({ message: "Event deleted successfully" });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error deleting event" });
    }
  },
  getAllEvents: async ({ page = 1, limit = 10, name = "", type = "" }) => {
    try {
      const cacheKey = `events:page=${page}:limit=${limit}:name=${name}:type=${type}`;

      const eventsFromCache = await redisDB.get(cacheKey);
      if (eventsFromCache) {
        return eventsFromCache;
      }

      const query = {};
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }

      if (type) {
        query = {
          ...query,
          type,
        };
      }

      const skip = (page - 1) * limit;
      const events = await Event.find(query).skip(skip).limit(limit);
      const totalCount = await Event.countDocuments(query);

      const response = new BaseResponseList({
        status: DEFINE_STATUS_RESPONSE.SUCCESS,
        list: events,
        totalCount,
        message: "Events fetched successfully",
      });

      await redisDB.set(cacheKey, response, {
        EX: 60,
      });

      return response;
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error fetching events" });
    }
  },
};

export default eventService;
