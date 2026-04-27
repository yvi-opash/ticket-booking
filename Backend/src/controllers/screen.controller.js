import * as screenServices from "../services/screen.services";


export const getScreensByTheater = async (req, res, next) => {
    try {
        const {theaterId} = req.params;
        const screen = await screenServices.getScreensByTheater(theaterId);
        res.status(200).json({ success: true, data: screens });

    } catch (error) {
        next(error)
    }
}


export const getScreenLayout