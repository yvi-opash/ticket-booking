import Screen from "../models/screens.model.js";
import Theater from "../models/theaters.model.js";

export const getScreensByTheater = async (theaterId) => {
    return await Screen.find({ theater: theaterId });
};

export const getScreenLayout = async (screenId) => {
    const screen = await Screen.findById(screenId);
    if (!screen) throw new Error("Screen not found");
    return screen;
};

export const createScreen = async (theaterId, screenData, organizerId) => {
    // Check if theater belongs to organizer
    const theater = await Theater.findOne({ _id: theaterId, organizer: organizerId });
    if (!theater) throw new Error("Theater not found or unauthorized");

    return await Screen.create({ ...screenData, theater: theaterId });
};

export const updateScreen = async (screenId, screenData, organizerId) => {
    const screen = await Screen.findById(screenId).populate("theater");
    if (!screen || screen.theater.organizer.toString() !== organizerId.toString()) {
        throw new Error("Screen not found or unauthorized");
    }

    Object.assign(screen, screenData);
    return await screen.save();
};
