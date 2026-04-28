import Showtime from "../models/showtimes.model.js";
import Seat from "../models/seats.model.js"
import mongoose from "mongoose";
import Screen from "../models/screens.model.js";

export const getShowTime = async (filters = {}) => {
    return await Showtime.find(filters).populate("movie").populate("screen");
};

export const getShowTimeById =  async (id) => {
    const showtime = await Showtime.findById(id).populate("movie").populate("screen");
    if(!showtime) throw new Error ("showtime not found");
    return showtime; 
};


export const getShowTimeSeats = async (showtimeId) => {
    return await Seat.find({ showtime: showtimeId}).sort({row:1 , number: 1});
};


export const createShowtime = async (showtimedata) => {
    try {
        const {screenId, movieId, starstAt} =showtimedata;
        
        const screen = await Screen.findById(screenId);
        if (!screen) throw new Error("Screen not found");

        const movie = await mongoose.model("Movie").findById(movieId);
        if(!movie) throw new Error("movie not found");

        const starts = new Date(starstAt);
        const ends = new Date(starts.getTime() + (movie.duration || 120)* 60000);

        const showtimeObj = {
            movie: movieId,
            screen: screenId,
            startsAt : starts,
            endsAt : ends,
            language : movie.language,
            format: "2D"
        };

        const result = await Showtime.create([showtimeObj]);
        const showtime = result[0];

        const seatsToInsert = [];
        for(let row = 1; row <= screen.rows; row++){
            let assignedTier = "Standard"
            
            let assignedPrice = showtimedata.price || 150;

            if(screen.tiers && screen.tiers.length > 0) {
                const matchedTier = screen.tiers.find(t => row >= t.rowStart && row <= t.rowEnd);
                if(matchedTier) {
                    assignedTier = matchedTier.tier;

                    assignedPrice = showtimedata.price || matchedTier.price || assignedPrice;
                }
            }

            for(let num = 1; num <= screen.seatsPerRow; num++){
                seatsToInsert.push({
                    showtime: showtime._id,
                    screen: screen._id,
                    row,
                    number: num,
                    tier: assignedTier,
                    price: assignedPrice,
                    status : "available"
                });
            }
        }

        if(seatsToInsert.length > 0){
            await Seat.insertMany(seatsToInsert)
        }
        return showtime
    } catch (error) {

    }
}

export const updateShowtime = async(id, showtimedata) => {
    const showtime = await Showtime.findByIdAndUpdate(id, showtimedata, {new: true});
    if (!showtime) throw new Error("Showtime not found");
    return showtime;
}