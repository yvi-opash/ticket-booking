import mongoose from "mongoose";

const seatsSchema = new mongoose.Schema(
  {
    showtime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Showtime",
      required: true,
    },

    screen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Screen",
      required: true,
    },

    row: { type: Number, required: true },

    number: { type: Number, required: true },

    tier: {
      type: String,
      enum: ["VIP", "Premium", "Standard"],
    },

    price: Number,

    status: {
      type: String,
      enum: ["available", "held", "sold"],
      default: "available",
    },
  },
  { timestamps: true }
);


seatsSchema.index({ showtime: 1, row: 1, number: 1 }, { unique: true });

export default mongoose.model("Seat", seatsSchema);