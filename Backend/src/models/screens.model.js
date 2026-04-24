import mongoose from "mongoose";

const tierSchema = new mongoose.Schema({
  tier: {
    type: String,
    enum: ["VIP", "Premium", "Standard"],
    required: true,
  },

  rowStart: Number,
  rowEnd: Number,

  price: Number,
});

const screensSchema = new mongoose.Schema({
    theater: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Theater",
        required : true
    },
    name: {
        type: String,
        required: true
    },
    rows: {
        type: Number,
        required: true
    },
    seatsPerRow: {
        type : Number,
        required: true
    },
    tiers: [tierSchema],

}, 
    {timestamps: true}
);

const Screen = mongoose.model("Screen", screensSchema);
export default Screen;