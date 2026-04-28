import express from "express";
import { getShowTime, getShowTimeById, getShowTimeSeats, createShowtime, updateShowtime } from "../controllers/showtime.controller.js";
import { protect, requireRole } from "../middleware/auth.js";
import { Role } from "../models/user.model.js";

const router = express.Router();

router.route("/")
    .get(getShowTime)
    .post(protect, requireRole(Role.ORGANIZER, Role.ADMIN), createShowtime);

router.route("/:id")
    .get(getShowTimeById)
    .put(protect, requireRole(Role.ORGANIZER, Role.ADMIN), updateShowtime);

router.get("/:id/seats", getShowTimeSeats);

export default router;
