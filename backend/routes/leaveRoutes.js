import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
  cancelLeave,
  getMyLeaveBalance
} from "../controllers/leaveController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, applyLeave);
router.get("/me", protect, getMyLeaves);
router.get("/balance", protect, getMyLeaveBalance);
router.get("/", protect, authorize("admin", "hr", "manager"), getAllLeaves);
router.put("/:id/status", protect, authorize("admin", "hr", "manager"), updateLeaveStatus);
router.put("/:id/cancel", protect, cancelLeave);

export default router;
