import * as theaterServices from "../services/theater.services.js";

export const getTheaters = async (req, res, next) => {
    try {
        const filters = req.query;

        const theaters = await theaterServices.getTheater(filters);
        res.status(200).json({ sucess : true, data : theaters})

    } catch (error) {
        next(error)
    }
}

export const getTheaterByOrganizer = async(req, res, next )=> {
    try {
        const organizerId = req.user.id;

        const theater = await theaterServices.getTheaterByOrganizer(organizerId);
        res.status(200).json({ success: true, data: theater });
    
    } catch (error) {
        next(error)
    }
}

export const createTheater = async (req, res, next) => {
    try {
        const organizerId = req.user.id;
        const theaterdata = req.body;

        const theater = await theaterServices.createTheater(theaterdata, organizerId);
        res.status(201).json({ success: true, data: theater });


    } catch (error) {
        next(error)
    }
}

export const updateTheater = async (req, res, next) => {
    try {
        const { id } = req.params;
        const theaterData = req.body;
        const organizerId = req.user.id;
        
        const theater = await theaterServices.updateTheater(id, theaterData, organizerId);
        res.status(200).json({ success: true, data: theater });

    } catch (error) {
        next(error)
    }
}