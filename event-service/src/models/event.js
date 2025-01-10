const { Schema, model } = require("mongoose");
const logger = require("../config/winston");

const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageThumbnail: {
      type: String,
    },
    time: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    capacity: {
      type: Number,
      required: true,
    },
    ticketsAvailable: { type: Number, required: true },
    priceTicket: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const deleteMany = async () => {
  try {
    const result = await Event.deleteMany({});
    logger.info(`Delete ${result.deletedCount} item successfully`);
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};

const insertMany = async (items) => {
  try {
    const result = await Event.insertMany(items);
    logger.info(`Insert ${result.length} item successfully`);
    return result;
  } catch (error) {
    logger.error("Insert failed:", error);
    throw error;
  }
};

const Event = model("Event", eventSchema);

module.exports = { Event, deleteMany, insertMany };
