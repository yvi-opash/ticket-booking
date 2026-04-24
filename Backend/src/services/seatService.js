import mongoose from "mongoose";
import Seat from "../models/seats.model.js";
import Hold from "../models/holds.model.js";
import { emitSeatUpdate } from "../config/socket.js";

/**
 * Temporarily holds a seat for a user.
 * Uses atomic update to prevent double holding.
 */
export const holdSeat = async (seatId, userId, showtimeId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Atomic update to ensure no double-booking at hold phase
        const updatedSeat = await Seat.findOneAndUpdate(
            { _id: seatId, status: "available", showtime: showtimeId },
            { $set: { status: "held" } },
            { new: true, session }
        );

        if (!updatedSeat) {
            throw new Error("Seat is no longer available");
        }

        // Hold expires in 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); 

        const hold = await Hold.create([{
            seat: seatId,
            user: userId,
            showtime: showtimeId,
            expiresAt
        }], { session });

        await session.commitTransaction();

        // Emit real-time update to all clients viewing this showtime
        emitSeatUpdate(showtimeId, 'seat:held', {
            seatId: updatedSeat._id,
            status: "held",
            heldBy: userId
        });

        return hold[0];
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

/**
 * Manually release a held seat.
 */
export const releaseSeat = async (seatId, userId, showtimeId) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Ensure the hold belongs to this user
        const hold = await Hold.findOne({ seat: seatId, user: userId, showtime: showtimeId }).session(session);

        if (!hold) {
            throw new Error("Hold not found or unauthorized to release");
        }

        // Set seat back to available
        const updatedSeat = await Seat.findByIdAndUpdate(
            seatId,
            { $set: { status: "available" } },
            { new: true, session }
        );

        // Delete hold
        await Hold.findByIdAndDelete(hold._id).session(session);

        await session.commitTransaction();

        // Emit real-time update
        if (updatedSeat) {
            emitSeatUpdate(showtimeId, 'seat:released', {
                seatId: updatedSeat._id,
                status: "available"
            });
        }

        return true;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};
