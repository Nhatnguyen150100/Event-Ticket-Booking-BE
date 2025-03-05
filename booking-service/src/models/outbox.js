const { Schema, model } = require("mongoose");

const outboxSchema = new Schema(
  {
    type: String,
    payload: Schema.Types.Mixed,
    status: {
      type: String,
      enum: ["PENDING", "PROCESSED", "FAILED"],
      default: "PENDING",
    },
    createdAt: { type: Date, default: Date.now },
    processedAt: Date,
    retries: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Outbox = model("Outbox", outboxSchema);

module.exports = { Outbox };
