import mongoose from "mongoose";

export const Language = {
    ENGLISH: "English",
    HINDI: "Hindi",
    GUJARATI: "Gujarati",
    MARATHI: "Marathi",
    TAMIL: "Tamil",
    TELUGU: "Telugu"
}

const movieSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true
    },
    description: {
        type : String,
        required: true,
    },
    language: {
      type: String,               
      enum: Object.values(Language),
      required: true,            
    },
    duration: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0, max: 10, 
    },
    posterUrl: {                  
      type: String,
    },
    genre: {                     
      type: String,
      required: true,
    },
    createdBy: {                 
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

},
    {timestamps: true}
)

const Movie = mongoose.model("Movie", movieSchema);
export default Movie;