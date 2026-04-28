import express from "express";
import { holdSeat, releaseSeat } from "../controllers/seat.controller.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.post("/hold", protect, holdSeat);
router.post("/release", protect, releaseSeat);

export default router;
