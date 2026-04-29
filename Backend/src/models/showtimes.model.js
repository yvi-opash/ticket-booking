import mongoose from "mongoose";

export const Language = {
    ENGLISH: "English",
    HINDI: "Hindi",
    GUJARATI: "Gujarati",
    MARATHI: "Marathi",
    TAMIL: "Tamil",
    TELUGU: "Telugu"
}

const showtimesSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true,
    },
    screen: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Screen",
        required : true,
    },
    startsAt: {
        type : Date,
        required : true,
    },
    endsAt: {
        type: Date,
        required: true
    },
    language:{
        enum: Object.values(Language),
        type : String,
    },
    format: {
        type: String,
        enum: ["2D", "3D", "IMAX"],
        default: "2D",
    },
    price: {
        type: Number,
        default: 10,
    }


}, {timestamps: true}
)


showtimesSchema.index({ movie: 1, startsAt: 1 });
showtimesSchema.index({ screen: 1, startsAt: 1 });

const Showtime = mongoose.model("Showtime" , showtimesSchema);

export default Showtime