import mongoose from "mongoose";
import Seat from "../models/seats.model.js";
import Hold from "../models/holds.model.js";
import { emitSeatUpdate } from "../config/socket.js";
import Showtime from "../models/showtimes.model.js";

export const holdSeat = async (seatId, userId, showtimeId) => {
    try {
        const updatedSeat = await Seat.findOneAndUpdate(
            {_id: seatId, status: "available", showtime: showtimeId},
            {$set: { status: "held"} },
            {new: true}
        );

        if(!updatedSeat){
            throw new Error ("Seat is no longer available");
        }

        const expiresAt = new Date(Date.now() + 10 *60 * 1000);

        const hold = await Hold.create([{
            seat: seatId,
            user: userId,
            showtime: showtimeId,
            expiresAt
        }]);

        emitSeatUpdate(showtimeId, 'seat:held', {
            showtimeId,
            seatId: updatedSeat._id,
            status:"held",
            heldBy: userId
        });

        return hold[0];

    } catch (error) {
        throw error;
    }
}

export const releaseSeat = async (seatId, userId, showtimeId) => {
    try {
        const hold = await Hold.findOne({seat: seatId, user: userId, showtime: showtimeId});

        if(!hold) {
            throw new Error("hold not found");
        }

        const updatedSeat = await Seat.findByIdAndUpdate(
            seatId,
            {$set : {status : "available"}},
            {new: true}
        );

        await Hold.findByIdAndDelete(hold._id);

        if(updatedSeat){
            emitSeatUpdate(showtimeId, 'seat:released', {
                showtimeId,
                seatId: updatedSeat._id,
                status: "available"
            });
        }

        return true;
    } catch (error) {
        throw error
    }
}