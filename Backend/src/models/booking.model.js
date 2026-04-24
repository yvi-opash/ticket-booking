import mongoose, { Types } from "mongoose";

const bookingsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    showtime : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Showtime",
        required : true
    },
        seats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seat",
      },
    ],

    totalAmount : Number,

    bookingId: {
      type: String,
      unique: true,
      required: true
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    qrCode: String,

}, {timestamps: true}
)

const Booking = mongoose.model("Booking", bookingsSchema);
export default Booking;