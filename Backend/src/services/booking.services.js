import mongoose from "mongoose";
import crypto from "crypto";
import Booking from "../models/booking.model.js";
import Seat from "../models/seats.model.js";
import Hold from "../models/holds.model.js";
import { emitSeatUpdate } from "../config/socket.js";


export const createBooking = async (userId, showtimeId, seatIds) => {
    try {
        let totalAmount = 0;
        const bookedSeats = [];

        for (const seatId of seatIds) {
            // Check if the seat is held by this user
            const hold = await Hold.findOne({ seat: seatId, user: userId, showtime: showtimeId });
            
            let updatedSeat;

            if (hold) {
                // If held by user, mark as sold
                updatedSeat = await Seat.findOneAndUpdate(
                    { _id: seatId, status: "held" },
                    { $set: { status: "sold" } },
                    { new: true }
                );
                // Remove hold document
                await Hold.findByIdAndDelete(hold._id);
            } else {
                // If they bypassed hold, attempt atomic claim from available
                updatedSeat = await Seat.findOneAndUpdate(
                    { _id: seatId, status: "available", showtime: showtimeId },
                    { $set: { status: "sold" } },
                    { new: true }
                );
            }

            if (!updatedSeat) {
                throw new Error(`Seat ${seatId} cannot be booked (already sold or held by another user)`);
            }

            totalAmount += (updatedSeat.price || 0);
            bookedSeats.push(updatedSeat);
        }

        // Generate booking ID and mock QR code
        const bookingId = "BKG-" + crypto.randomBytes(4).toString("hex").toUpperCase();
        const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${bookingId}`;

        const booking = await Booking.create([{
            user: userId,
            showtime: showtimeId,
            seats: seatIds,
            totalAmount,
            bookingId,
            status: "confirmed",
            qrCode
        }]);

        // Emit real-time socket events for all sold seats
        for (const seat of bookedSeats) {
            emitSeatUpdate(showtimeId, 'seat:sold', {
                showtimeId,
                seatId: seat._id,
                status: "sold"
            });
        }

        return booking[0];
    } catch (error) {
        throw error;
    }
};


export const cancelBooking = async (bookingId, userId) => {
    try {
        const booking = await Booking.findOne({ _id: bookingId, user: userId, status: "confirmed" })
                                     .populate('showtime');

        if (!booking) {
            throw new Error("Booking not found or already cancelled");
        }

        // Check if showtime has already started
        if (new Date() >= new Date(booking.showtime.startsAt)) {
            throw new Error("Cannot cancel a booking after the showtime has started");
        }

        // Update booking status
        booking.status = "cancelled";
        await booking.save();

        // Release seats
        for (const seatId of booking.seats) {
            const updatedSeat = await Seat.findByIdAndUpdate(
                seatId,
                { $set: { status: "available" } },
                { new: true }
            );

            // Emit real-time update
            if (updatedSeat) {
                emitSeatUpdate(booking.showtime._id, 'seat:released', {
                    showtimeId: booking.showtime._id,
                    seatId: updatedSeat._id,
                    status: "available"
                });
            }
        }

        return booking;
    } catch (error) {
        throw error;
    }
};

export const getMyBookings = async (userId) => {
    return await Booking.find({ user: userId })
        .populate({
            path: 'showtime',
            populate: [
                { path: 'movie' },
                { 
                    path: 'screen',
                    populate: { path: 'theater' }
                }
            ]
        })
        .populate('seats')
        .sort({ createdAt: -1 });
};

export const getAllBookings = async (filters = {}) => {
    return await Booking.find(filters)
        .populate("user", "name email")
        .populate({
            path: 'showtime',
            populate: [
                { path: 'movie' },
                { 
                    path: 'screen',
                    populate: { path: 'theater' }
                }
            ]
        })
        .populate('seats')
        .sort({ createdAt: -1 });
};
