import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseResponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import logger from "../config/winston";
import { Ticket } from "../models/ticket";

const ticketsService = {
  createTicket: async (data) => {
    try {
      const { eventId, type, price, quantity } = data;
      const newTicket = new Ticket({
        eventId,
        type,
        price,
        quantity,
      });
      const savedTicket = await newTicket.save();
      return new BaseSuccessResponse({
        data: savedTicket,
        message: "Ticket created successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error creating ticket" });
    }
  },
  getTicketById: async (id) => {
    try {
      const ticket = await Ticket.findById(id);
      if (!ticket) {
        return new BaseErrorResponse({ message: "Ticket not found" });
      }
      return new BaseSuccessResponse({
        data: ticket,
        message: "Ticket fetched successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error fetching ticket" });
    }
  },
  updateTicket: async (id, data) => {
    try {
      const updatedTicket = await Ticket.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!updatedTicket) {
        return new BaseErrorResponse({ message: "Ticket not found" });
      }
      return new BaseSuccessResponse({
        data: updatedTicket,
        message: "Ticket updated successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error updating ticket" });
    }
  },
  deleteTicket: async (id) => {
    try {
      const deletedEvent = await Ticket.findByIdAndDelete(id);
      if (!deletedEvent) {
        return new BaseErrorResponse({ message: "Ticket not found" });
      }
      return new BaseSuccessResponse({
        message: "Ticket deleted successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error deleting ticket" });
    }
  },
  deleteListTickets: async (ticketIds) => {
    try {
      await Ticket.deleteMany({ _id: { $in: ticketIds } });
      return new BaseSuccessResponse({
        message: "Tickets deleted successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error deleting tickets" });
    }
  },
  getAllTicketFromEvent: async (page = 1, limit = 10, eventId) => {
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

export default ticketsService;
