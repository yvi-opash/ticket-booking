import mongoose from "mongoose";

const holdsSchema = new mongoose.Schema({
    seat : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Seat",
        required: true
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true        
    },
    showtime: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Showtime",
        required: true
    },
    expiresAt: {
      type: Date,
      required: true,
    },
}, {timestamps: true})

holdsSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Hold = mongoose.model("Hold", holdsSchema);

export default Hold;
