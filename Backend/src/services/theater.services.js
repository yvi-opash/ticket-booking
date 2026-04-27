import Theater from "../models/theaters.model";

export const getTheater = async (filters = {}) => {
    return await Theater.find(filters).populate("organizer", "name, email");
};

export const getTheaterByOrganizer = async(organizerId) => {
    return await Theater.find({organizer : organizerId});
};

export const createTheater = async (theaterdata, organizerId) => {
    return await Theater.create({...theaterdata, organizer: organizerId});
};

export const updateTheater = async (id, theaterdata, organizerId) => {

    const theater = await Theater.findOne({ _id : id, organizer: organizerId});
    if (!theater) throw new Error("Theater not found or unauthorized");

    Object.assign(theater, theaterdata);
    return await theater.save();
}
