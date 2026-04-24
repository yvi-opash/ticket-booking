import mongoose from "mongoose";


const theatersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    organizer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isActive: {               
      type: Boolean,
      default: true,
    },
}, 
    {timestamps: true}
)

theaterSchema.index({ city: 1 });

const Theater = mongoose.model("Theater", theatersSchema);
export default Theater;