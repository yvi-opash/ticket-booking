import express from "express";
import { createBooking, cancelBooking, getMyBookings, getAllBookings } from "../controllers/booking.controller.js";
import { protect, requireRole } from "../middleware/auth.js";
import { Role } from "../models/user.model.js";

const router = express.Router();

router.use(protect); 
router.post("/", createBooking);
router.get("/my-bookings", getMyBookings);
router.post("/:id/cancel", cancelBooking);


router.get("/all", requireRole(Role.ADMIN), getAllBookings);

export default router;
