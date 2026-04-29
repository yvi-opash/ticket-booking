import * as movieServices from "../services/movie.services.js";


export const getMovies = async (req, res, next ) => {
    try {
        const filters = req.query;
        const movies = await movieServices.getMovies(filters);
        res.status(200).json({ sucess: true, data: movies})
    } catch (error) {
        next(error)
    }
}


export const getMovieById= async (req, res, next) => {
    try {
        const {id} = req.params;

        const movies = await movieServices.getMovieById(id);
        res.status(200).json({ sucess: true, data: movies})
    } catch (error) {
        next(error)
    }
}


export const createMovie = async (req, res, next) => {
    try {
        const moviedata= req.body;

        if(!moviedata.createdBy && req.user) {
            moviedata.createdBy = req.user.id;
        }
        const movie = await movieServices.createMovie(moviedata);
        res.status(201).json({ success: true, data: movie });

    } catch (error) {
        next(error)
    }
}

export const updateMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        const movieData = req.body;
        const movie = await movieServices.updateMovie(movieData, id);
        res.status(200).json({ success: true, data: movie });
    } catch (error) {
        next(error);
    }
};

export const deleteMovie = async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await movieServices.deleteMovie(id);
        res.status(200).json({ success: true, data: movie });
    } catch (error) {
        next(error);
    }
};

