import mongoose from "mongoose";
import Showtime from "../models/showtimes.model.js";
import Screen from "../models/screens.model.js";
import Seat from "../models/seats.model.js";

export const getShowtimes = async (filters = {}) => {
    return await Showtime.find(filters).populate("movie").populate("screen");
};

export const getShowtimeById = async (id) => {
    const showtime = await Showtime.findById(id).populate("movie").populate("screen");
    if (!showtime) throw new Error("Showtime not found");
    return showtime;
};

export const getShowtimeSeats = async (showtimeId) => {
    return await Seat.find({ showtime: showtimeId }).sort({ row: 1, number: 1 });
};

export const createShowtime = async (showtimeData) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { screen: screenId } = showtimeData;
        const screen = await Screen.findById(screenId).session(session);
        if (!screen) throw new Error("Screen not found");

        const showtime = await Showtime.create([showtimeData], { session });

        // Auto-seed seats for this screen's layout
        const seatsToInsert = [];
        
        for (let row = 1; row <= screen.rows; row++) {
            // Determine tier based on rowRange
            let assignedTier = "Standard";
            let assignedPrice = 0;

            if (screen.tiers && screen.tiers.length > 0) {
                const matchedTier = screen.tiers.find(t => row >= t.rowStart && row <= t.rowEnd);
                if (matchedTier) {
                    assignedTier = matchedTier.tier;
                    assignedPrice = matchedTier.price;
                }
            }

            for (let num = 1; num <= screen.seatsPerRow; num++) {
                seatsToInsert.push({
                    showtime: showtime[0]._id,
                    screen: screen._id,
                    row,
                    number: num,
                    tier: assignedTier,
                    price: assignedPrice,
                    status: "available"
                });
            }
        }

        if (seatsToInsert.length > 0) {
            await Seat.insertMany(seatsToInsert, { session });
        }

        await session.commitTransaction();
        return showtime[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const updateShowtime = async (id, showtimeData) => {
    const showtime = await Showtime.findByIdAndUpdate(id, showtimeData, { new: true });
    if (!showtime) throw new Error("Showtime not found");
    return showtime;
};
