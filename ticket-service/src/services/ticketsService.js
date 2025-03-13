"use strict";
import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseResponse";
import redisDB from "../config/redisDB";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import logger from "../config/winston";
import rabbitMQHandler from "../handler/rabbitMQHandler";
import { Ticket } from "../models/ticket";

const ticketsService = {
  createTicket: async (data) => {
    try {
      const { eventId, type, price, quantity } = data;

      const existsTicketType = await Ticket.findOne({
        eventId,
        type: type ?? "GENERAL",
      });

      if (existsTicketType) {
        return new BaseErrorResponse({
          message: "Ticket type already exists for this event",
        });
      }

      const event = await rabbitMQHandler.getEventDetail(eventId);
      if (!event.data?._id) {
        return new BaseErrorResponse({ message: "Event not found" });
      }

      const tickets = await Ticket.find({ eventId });

      const total = tickets.reduce((accumulator, ticket) => {
        return accumulator + ticket.quantity;
      }, 0);

      if (total + quantity > event.data.capacity) {
        return new BaseErrorResponse({
          message: "Tickets limit exceeded for this event",
        });
      }

      const newTicket = new Ticket({
        eventId,
        type,
        price,
        quantity,
      });

      const savedTicket = await newTicket.save();
      await redisDB.delPattern(`tickets:eventId=${eventId}:*`);

      return new BaseSuccessResponse({
        data: savedTicket,
        message: "Ticket created successfully",
      });
    } catch (error) {
      logger.error("Error creating ticket:", error);
      return new BaseErrorResponse({ message: "Error creating ticket" });
    }
  },
  getTicketById: async (id, isGetEventInfo = true) => {
    const cacheKey = `ticket:${id}`;
    try {
      const cachedData = await redisDB.get(cacheKey);
      if (cachedData) return cachedData;

      const ticket = await Ticket.findById(id);
      if (!ticket) {
        return new BaseErrorResponse({ message: "Ticket not found" });
      }

      let response;
      if (isGetEventInfo) {
        const event = await rabbitMQHandler.getEventDetail(ticket.eventId);
        response = new BaseSuccessResponse({
          data: { ...ticket.toObject(), event },
          message: "Ticket fetched successfully",
        });
      } else {
        response = new BaseSuccessResponse({
          data: ticket,
          message: "Ticket fetched successfully",
        });
      }

      await redisDB.set(cacheKey, response, { EX: 60 });
      return response;
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error fetching ticket" });
    }
  },
  updateTicket: async (id, data) => {
    try {
      const { type, price, quantity } = data;
      const updatedTicket = await Ticket.findByIdAndUpdate(
        id,
        {
          type,
          price,
          quantity,
        },
        {
          new: true,
        },
      );
      if (!updatedTicket) {
        return new BaseErrorResponse({ message: "Ticket not found" });
      }
      await redisDB.del(`ticket:${id}`);
      await redisDB.delPattern(`tickets:eventId=${updatedTicket.eventId}:*`);

      return new BaseSuccessResponse({
        data: updatedTicket,
        message: "Ticket updated successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error updating ticket" });
    }
  },
  updateSoldQuantityTicket: async (id, soldQuantity, operation) => {
    try {
      if (typeof soldQuantity !== "number" || soldQuantity <= 0) {
        return new BaseErrorResponse({ message: "Invalid quantity value" });
      }

      const updatedTicket = await Ticket.findByIdAndUpdate(
        id,
        {
          $inc: {
            soldQuantity:
              operation === "INCREMENT" ? soldQuantity : -soldQuantity,
          },
        },
        { new: true },
      );

      if (!updatedTicket) {
        return new BaseErrorResponse({ message: "Ticket not found" });
      }

      return new BaseSuccessResponse({
        data: updatedTicket,
        message: "Sold quantity updated successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error updating ticket" });
    }
  },
  deleteTicket: async (id) => {
    try {
      const deletedEvent = await Ticket.findById(id);
      if (!deletedEvent) {
        return new BaseErrorResponse({ message: "Ticket not found" });
      }

      await redisDB.del(`ticket:${id}`);
      await redisDB.delPattern(`tickets:eventId=${deletedTicket.eventId}:*`);

      await Ticket.findByIdAndDelete(id);

      return new BaseSuccessResponse({
        message: "Ticket deleted successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error deleting ticket" });
    }
  },
  deleteListTickets: async (eventId) => {
    try {
      await Ticket.deleteMany({ eventId });
      await redisDB.delPattern(`tickets:eventId=${eventId}:*`);

      return new BaseSuccessResponse({
        message: "Tickets deleted successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error deleting tickets" });
    }
  },
  getAllTicketFromEvent: async ({ page = 1, limit = 10, eventId }) => {
    const cacheKey = `tickets:eventId=${eventId}:page=${page}:limit=${limit}`;
    try {
      const cachedData = await redisDB.get(cacheKey);
      if (cachedData) return cachedData;

      if (!eventId) {
        return new BaseErrorResponse({ message: "Event ID is required" });
      }

      const query = {
        eventId,
      };

      const skip = (page - 1) * limit;
      const tickets = await Ticket.find(query).skip(skip).limit(limit);
      const totalCount = await Ticket.countDocuments(query);

      const response = new BaseResponseList({
        status: DEFINE_STATUS_RESPONSE.SUCCESS,
        list: tickets,
        totalCount,
        message: "Tickets fetched successfully",
      });

      await redisDB.set(cacheKey, response, { EX: 60 });
      
      return response;
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error fetching tickets" });
    }
  },
};

export default ticketsService;
