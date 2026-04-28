import * as seatService from "../services/seat.services.js";

export const holdSeat = async (req, res, next) => {
    try {
        const { seatId, showtimeId } = req.body;
        const userId = req.user.id;
        
        if (!seatId || !showtimeId) {
            return res.status(400).json({ success: false, message: "seatId and showtimeId are required" });
        }

        const hold = await seatService.holdSeat(seatId, userId, showtimeId);
        res.status(200).json({ success: true, data: hold });
    } catch (error) {
        next(error);
    }
};

export const releaseSeat = async (req, res, next) => {
    try {
        const { seatId, showtimeId } = req.body;
        const userId = req.user.id;

        if (!seatId || !showtimeId) {
            return res.status(400).json({ success: false, message: "seatId and showtimeId are required" });
        }

        await seatService.releaseSeat(seatId, userId, showtimeId);
        res.status(200).json({ success: true, message: "Seat released successfully" });
    } catch (error) {
        next(error);
    }
};
