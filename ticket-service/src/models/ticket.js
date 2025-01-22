const { Schema, model, default: mongoose } = require("mongoose");
const logger = require("../config/winston");

const ticketSchema = new Schema(
  {
    availableTicket: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    idCategory: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    idEvent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Event",
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

const Event = model("Event", ticketSchema);

module.exports = { Event, deleteMany, insertMany };
