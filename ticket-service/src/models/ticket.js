const { Schema, model, default: mongoose } = require("mongoose");
const logger = require("../config/winston");

const ticketSchema = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    type: {
      type: String,
      enum: ["VIP", "GENERAL", "VIP_PLUS", "VIP_PLATINUM"],
      default: "GENERAL",
    },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    soldQuantity: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const deleteMany = async () => {
  try {
    const result = await Ticket.deleteMany({});
    logger.info(`Delete ${result.deletedCount} item successfully`);
    return result;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};

const insertMany = async (items) => {
  try {
    const result = await Ticket.insertMany(items);
    logger.info(`Insert ${result.length} item successfully`);
    return result;
  } catch (error) {
    logger.error("Insert failed:", error);
    throw error;
  }
};

const Ticket = model("Ticket", ticketSchema);

module.exports = { Ticket, deleteMany, insertMany };
