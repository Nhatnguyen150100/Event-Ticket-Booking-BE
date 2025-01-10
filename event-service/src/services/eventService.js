import { BaseErrorResponse, BaseResponseList, BaseSuccessResponse } from "../config/baseResponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import logger from "../config/winston";
import { Event } from "../models/event";

const eventService = {
  createEvent: async (data) => {
    try {
      const {
        name,
        imageThumbnail,
        time,
        location,
        description,
        capacity,
        ticketsAvailable,
        priceTicket,
      } = data;
      const newEvent = new Event({
        name,
        imageThumbnail,
        time,
        location,
        description,
        capacity,
        ticketsAvailable,
        priceTicket,
      });
      const savedEvent = await newEvent.save();
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
      const event = await Event.findById(id);
      if (!event) {
        return new BaseErrorResponse({ message: "Event not found" });
      }
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
      const updatedEvent = await Event.findByIdAndUpdate(id, data, {
        new: true,
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
      const deletedEvent = await Event.findByIdAndDelete(id);
      if (!deletedEvent) {
        return new BaseErrorResponse({ message: "Event not found" });
      }
      return new BaseSuccessResponse({ message: "Event deleted successfully" });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error deleting event" });
    }
  },
  getAllEvents: async (page = 1, limit = 10, name = "") => {
    try {
      const query = {};
      if (name) {
        query.name = { $regex: name, $options: "i" };
      }

      const skip = (page - 1) * limit;
      const events = await Event.find(query).skip(skip).limit(limit);
      const totalCount = await Event.countDocuments(query);

      return new BaseResponseList({
        status: DEFINE_STATUS_RESPONSE.SUCCESS,
        list: events,
        totalCount,
        message: "Events fetched successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error fetching events" });
    }
  },
};

export default eventService;
