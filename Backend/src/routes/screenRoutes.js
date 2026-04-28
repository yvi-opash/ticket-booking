import express from "express";
import { getScreensByTheater, getScreenLayout, createScreen, updateScreen } from "../controllers/screen.controller.js";
import { protect, requireRole } from "../middleware/auth.js";
import { Role } from "../models/user.model.js";

const router = express.Router();


router.get("/theater/:theaterId", getScreensByTheater);


router.get("/:screenId", getScreenLayout);


router.post("/", protect, requireRole(Role.ORGANIZER, Role.ADMIN), createScreen);
router.put("/:screenId", protect, requireRole(Role.ORGANIZER, Role.ADMIN), updateScreen);

export default router;
