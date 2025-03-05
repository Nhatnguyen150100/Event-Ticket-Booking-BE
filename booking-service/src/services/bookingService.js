"use strict";
import mongoose from "mongoose";
import {
  BaseErrorResponse,
  BaseResponseList,
  BaseSuccessResponse,
} from "../config/baseResponse";
import { DEFINE_STATUS_RESPONSE } from "../config/statusResponse";
import logger from "../config/winston";
import { Booking } from "../models/booking";
import { Outbox } from "../models/outbox";
import rabbitMQHandler from "../handler/rabbitMQHandler";

const bookingService = {
  createBooking: async (data) => {
    const session = await mongoose.startSession();
    try {
      const { userId, ticketId, quantity } = data;
      if (!quantity) {
        return new BaseErrorResponse({ message: "Quantity must be provided" });
      }

      const ticketDetail = await rabbitMQHandler.getTicketFromTicketId(
        ticketId,
      );
      console.log("🚀 ~ createBooking: ~ ticketDetail:", ticketDetail)

      session.startTransaction();

      const booking = new Booking({
        userId,
        ticketId,
        eventId: ticketDetail.eventId,
        quantity,
        totalPrice: ticketDetail.price * quantity,
      });

      await booking.save({ session });

      const outbox = new Outbox({
        type: "TICKET_UPDATE",
        payload: {
          ticketId: ticketId,
          quantity: quantity,
          operation: "DECREMENT",
        },
        status: "PENDING",
      });

      await outbox.save({ session });

      await session.commitTransaction();

      return new BaseSuccessResponse({
        data: booking,
        message: "Booking created successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: error?.message ?? "Created booking failed",
      });
    } finally {
      session.endSession();
    }
  },
  getListBookingByUserId: async ({ userId, page = 1, limit = 10 }) => {
    try {
      const query = {
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
