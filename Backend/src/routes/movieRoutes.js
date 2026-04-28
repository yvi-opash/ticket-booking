import express from "express";
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "../controllers/movie.controller.js";
import { protect, requireRole } from "../middleware/auth.js";
import { Role } from "../models/user.model.js";

const router = express.Router();

router.route("/")
    .get(getMovies)
    .post(protect, requireRole(Role.ADMIN), createMovie);

router.route("/:id")
    .get(getMovieById)
    .put(protect, requireRole(Role.ADMIN), updateMovie)
    .delete(protect, requireRole(Role.ADMIN), deleteMovie);

export default router;
