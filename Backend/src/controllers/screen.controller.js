import * as screenService from "../services/screen.services.js";

export const getScreensByTheater = async (req, res, next) => {
    try {
        const { theaterId } = req.params;
        const screens = await screenService.getScreensByTheater(theaterId);
        res.status(200).json({ success: true, data: screens });
    } catch (error) {
        next(error);
    }
};

export const getScreenLayout = async (req, res, next) => {
    try {
        const { screenId } = req.params;
        const screen = await screenService.getScreenLayout(screenId);
        res.status(200).json({ success: true, data: screen });
    } catch (error) {
        next(error);
    }
};

export const createScreen = async (req, res, next) => {
    try {
       
        const { theaterId, ...screenData } = req.body;
        const organizerId = req.user.id;
        
        if (!theaterId) {
            return res.status(400).json({ success: false, message: "theaterId is required" });
        }

        const screen = await screenService.createScreen(theaterId, screenData, organizerId);
        res.status(201).json({ success: true, data: screen });
    } catch (error) {
        next(error);
    }
};

export const updateScreen = async (req, res, next) => {
    try {
        const { screenId } = req.params;
        const screenData = req.body;
        const organizerId = req.user.id;
        const screen = await screenService.updateScreen(screenId, screenData, organizerId);
        res.status(200).json({ success: true, data: screen });
    } catch (error) {
        next(error);
    }
};
