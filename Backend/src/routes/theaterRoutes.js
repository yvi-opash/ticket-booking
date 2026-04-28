import express from "express";
import { getTheaters, getTheaterByOrganizer, createTheater, updateTheater } from "../controllers/theater.controller.js";
import { protect, requireRole } from "../middleware/auth.js";
import { Role } from "../models/user.model.js";

const router = express.Router();


router.get("/", getTheaters);


router.get("/my-theaters", protect, requireRole(Role.ORGANIZER), getTheaterByOrganizer);
router.post("/", protect, requireRole(Role.ORGANIZER, Role.ADMIN), createTheater);
router.put("/:id", protect, requireRole(Role.ORGANIZER, Role.ADMIN), updateTheater);

export default router;
