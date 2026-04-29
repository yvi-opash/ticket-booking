import * as bookingService from "../services/booking.services.js";

export const createBooking = async (req, res, next) => {
    try {
        const { showtimeId, seatIds } = req.body;
        const userId = req.user.id;

        if (!showtimeId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
            return res.status(400).json({ success: false, message: "showtimeId and a non-empty array of seatIds are required" });
        }

        const booking = await bookingService.createBooking(userId, showtimeId, seatIds);
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

export const cancelBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const booking = await bookingService.cancelBooking(id, userId);
        res.status(200).json({ success: true, data: booking, message: "Booking cancelled successfully" });
    } catch (error) {
        next(error);
    }
};

export const getMyBookings = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookings = await bookingService.getMyBookings(userId);
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        next(error);
    }
};

export const getAllBookings = async (req, res, next) => {
    try {
        const filters = req.query;
        const bookings = await bookingService.getAllBookings(filters);
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        next(error);
    }
};
