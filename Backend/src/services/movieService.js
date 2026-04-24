import Movie from "../models/movie.model.js";

export const getMovies = async (filters = {}) => {
    // Add logic to parse filters, pagination, etc.
    return await Movie.find(filters);
};

export const getMovieById = async (id) => {
    const movie = await Movie.findById(id);
    if (!movie) throw new Error("Movie not found");
    return movie;
};

export const createMovie = async (movieData) => {
    return await Movie.create(movieData);
};

export const updateMovie = async (id, movieData) => {
    const movie = await Movie.findByIdAndUpdate(id, movieData, { new: true });
    if (!movie) throw new Error("Movie not found");
    return movie;
};

export const deleteMovie = async (id) => {
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) throw new Error("Movie not found");
    return movie;
};
