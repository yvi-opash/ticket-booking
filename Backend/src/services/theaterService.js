import Theater from "../models/theaters.model.js";

export const getTheaters = async (filters = {}) => {
    return await Theater.find(filters).populate("organizer", "name email");
};

export const getTheatersByOrganizer = async (organizerId) => {
    return await Theater.find({ organizer: organizerId });
};

export const createTheater = async (theaterData, organizerId) => {
    return await Theater.create({ ...theaterData, organizer: organizerId });
};

export const updateTheater = async (id, theaterData, organizerId) => {
    // Ensure the theater belongs to this organizer
    const theater = await Theater.findOne({ _id: id, organizer: organizerId });
    if (!theater) throw new Error("Theater not found or unauthorized");

    Object.assign(theater, theaterData);
    return await theater.save();
};
