"use strict";
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
    try {
      const { userId, ticketId, quantity: castQuantity } = data;
      const quantity = parseInt(castQuantity);
      if (!quantity) {
        return new BaseErrorResponse({ message: "Quantity must be provided" });
      }

      const { data: ticketDetail } =
        await rabbitMQHandler.getTicketFromTicketId(ticketId);

      if (quantity > ticketDetail?.quantity - ticketDetail?.soldQuantity) {
        return reject(
          new BaseErrorResponse({ message: "Not enough quantity" }),
        );
      }

      const booking = new Booking({
        userId,
        ticketId,
        eventId: ticketDetail.eventId,
        quantity,
        totalPrice: ticketDetail.price * quantity,
      });

      await booking.save();

      const outbox = new Outbox({
        type: "TICKET_UPDATE",
        payload: {
          ticketId: ticketId,
          quantity: quantity,
          operation: "INCREMENT",
        },
        status: "PENDING",
      });

      await outbox.save();

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
  cancelBooking: async (userId, bookingId) => {
    try {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return new BaseErrorResponse({ message: "Booking not found" });
      }

      if (booking.userId.toString() !== userId) {
        return new BaseErrorResponse({
          message: "You are not authorized to cancel this booking",
        });
      }

      const refund = await rabbitMQHandler.refundPayment({
        userId: booking.userId,
        booking,
      });

      if (!refund) {
        return new BaseErrorResponse({ message: "Refund failed" });
      }

      const cancelBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          status: "CANCELLED",
        },
        {
          new: true,
        },
      );
      if (!cancelBooking) {
        return new BaseErrorResponse({ message: "Booking not found" });
      }

      const outbox = new Outbox({
        type: "TICKET_UPDATE",
        payload: {
          ticketId: cancelBooking.ticketId,
          quantity: cancelBooking.quantity,
          operation: "DECREMENT",
        },
        status: "PENDING",
      });

      await outbox.save();

      return new BaseSuccessResponse({
        data: cancelBooking,
        message: "Booking cancel successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({
        message: error?.message ?? "Cancel booking failed",
      });
    }
  },
  createRequestBooking: async (userId, data) => {
    try {
      const { ticketId, quantity } = data;
      if (!quantity) {
        return new BaseErrorResponse({ message: "Quantity must be provided" });
      }
      const ticketDetail = await rabbitMQHandler.getTicketFromTicketId(
        ticketId,
      );
      if (
        quantity >
        ticketDetail?.data.quantity - ticketDetail?.data.soldQuantity
      ) {
        return reject(
          new BaseErrorResponse({ message: "Not enough quantity" }),
        );
      }
      const amount = ticketDetail?.data.price * quantity * 100;

      const payment = await rabbitMQHandler.createPaymentBooking({
        userId,
        ticketId,
        quantity,
        amount,
      });
      return new BaseSuccessResponse({
        data: payment.data,
        message: "Payment request sent successfully",
      });
    } catch (error) {
      logger.error(error.message);
      return new BaseErrorResponse({ message: "Error fetching booking" });
    }
  },
  getListBookingByUserId: async ({
    userId,
    page = 1,
    limit = 10,
    status = "CONFIRMED",
  }) => {
    try {
      const query = {
        userId,
        status,
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
