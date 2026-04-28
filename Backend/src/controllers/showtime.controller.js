import * as showtimeServices from "../services/showtime.services.js";

export const getShowTime = async (req, res, next) => {
    try {
        const filters = req.query;

        const showtime = await showtimeServices.getShowTime(filters)
        res.status(200).json({ success: true, data: showtime });
    } catch (error) {
        next(error);
    }
}

export const getShowTimeById = async (req, res, next) => {
    try {
        const {id} = req.params;

        const showtime = await showtimeServices.getShowTimeById(id);
        res.status(200).json({ success: true, data: showtime });

    } catch (error) {
        next(error)
    }
}

export const getShowTimeSeats = async(req, res, next) => {
    try {
        const {id} = req.params;
        
        const seats = await showtimeServices.getShowTimeSeats(id)
        res.status(200).json({ success: true, data: seats });

    } catch (error) {
        nect (error)
    }
}

export const createShowtime = async(req, res, next) => {
    try {
        const { showtimedata } = req.body;

        const showtime = await showtimeServices.createShowtime(showtimedata);
        res.status(200).json({ success: true, data: showtime });
    } catch (error) {
        next(error)
    }
}

export const updateShowtime = async(req, res, next) => {
    try {
        const {id} = req.params;
        const{showtimedata} = req.body;

        const update = await showtimeServices.updateShowtime(id, showtimedata);
        res.status(200).json({ success: true, data: showtimes });
    } catch (error) {
        next(error)
    }
}