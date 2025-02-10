"use strict";
import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseResponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import logger from "../config/winston";
import rabbitMQHandler from "../handler/rabbitMQHandler";
import { Booking } from "../models/booking";

const bookingService = {
  createBooking: async (data) => {
    try {
      const { userId, ticketId, quantity } = data;
      if (!quantity) {
        return new BaseErrorResponse({ message: "Quantity must be provided" });
      }
      const ticketDetail = await rabbitMQHandler.getTicketFromTicketId(
        ticketId,
      );
      if (!ticketDetail?.data?._id) {
        return new BaseErrorResponse({ message: "Invalid ticketId" });
      }
      
      if(quantity > ticketDetail.data.quantity) {
        return new BaseErrorResponse({ message: "Not enough quantity available" });
      }

      const booking = new Booking({
        userId,
        ticketId,
        eventId: ticketDetail.data.eventId,
        quantity,
        totalPrice: ticketDetail.data.price * quantity,
      });

      await booking.save();

      return new BaseSuccessResponse({
        data: booking,
        message: "Booking created successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: error?.message ?? "Created booking failed",
      });
    }
  },
  getListBookingByUserId: async ({ userId, page = 1, limit = 10 }) => {
    try {
      let query = {
        userId,
      };

      const skip = (page - 1) * limit;

      const bookings = await Booking.find(query)
        .skip(skip)
        .limit(limit)
        .populate("ticketId eventId");
      const totalCount = await Booking.countDocuments(query);

      return new BaseResponseList({
        status: DEFINE_STATUS_RESPONSE.SUCCESS,
        list: bookings,
        totalCount,
        message: "Bookings fetched successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error fetching booking" });
    }
  },
  getBookingDetail: async (bookingId) => {
    try {
      const booking = await Booking.findById(bookingId).populate(
        "ticketId eventId",
      );
      if (!booking) {
        return new BaseErrorResponse({ message: "Booking not found" });
      }
      return new BaseSuccessResponse({
        data: booking,
        message: "Booking fetched successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error fetching booking" });
    }
  },
};

export default bookingService;
