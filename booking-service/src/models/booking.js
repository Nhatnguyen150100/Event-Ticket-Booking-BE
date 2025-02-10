const { Schema, model, default: mongoose } = require("mongoose");
const logger = require("../config/winston");
require('./ticket');
require('./event');

const bookingSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const deleteMany = async () => {
  try {
    const result = await Booking.deleteMany({});
    logger.info(`Delete ${result.deletedCount} bookings successfully`);
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};

const insertMany = async (items) => {
  try {
    const result = await Booking.insertMany(items);
    logger.info(`Insert ${result.length} bookings successfully`);
    return result;
  } catch (error) {
    logger.error("Insert failed:", error);
    throw error;
  }
};

const Booking = model("Booking", bookingSchema);

module.exports = { Booking, deleteMany, insertMany };