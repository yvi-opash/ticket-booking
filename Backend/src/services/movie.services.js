import Movie from "../models/movie.model.js";


export const getMovies = async (filters = {}) => {
    const { page = 1, limit = 12, genre, language, title} = filters;

    const query = {};
    if (genre) query.genre = genre;
    if(language) query.language = language;
    if(title) query.title = {$regex: title, $options: "i"};

    const skip = (page -1 ) * limit;

    return await Movie.find(query)
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(Number(limit));
}

export const getMovieById = async (id) => {
    const movie =await Movie.findById(id);
    if(!movie) throw new Error("Movie not found");
    return movie;
};

export const createMovie = async (moviedata) => {
    return await Movie.create(moviedata)
};

export const updateMovie = async (moviedata, id) => {
    const movie = await Movie.findByIdAndUpdate(id, moviedata, {new: true});
    if(!movie) throw new Error("movie not found");
    return movie;
};

export const deleteMovie = async(id) => {
    const movie = await Movie.findByIdAndDelete(id);
    if(!movie) throw new Error("movienot found");
    return movie;
}
