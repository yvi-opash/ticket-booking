import express from "express";
import { getUser, approveOrganizer, updateUserRole } from "../controllers/admin.controller.js";
import { protect, requireRole } from "../middleware/auth.js";
import { Role } from "../models/user.model.js";

const router = express.Router();


router.use(protect);
router.use(requireRole(Role.ADMIN));

router.get("/users", getUser);
router.put("/users/:id/approve-organizer", approveOrganizer);
router.put("/users/:id/role", updateUserRole);

export default router;
