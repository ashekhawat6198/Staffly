import express from "express";
import {
  createJobPosition,
  getJobPositions,
  getJobPositionById,
  updateJobPosition,
  deleteJobPosition
} from "../controllers/jobPositionController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("admin", "hr"), createJobPosition);
router.get("/", protect, getJobPositions);
router.get("/:id", protect, getJobPositionById);
router.put("/:id", protect, authorize("admin", "hr"), updateJobPosition);
router.delete("/:id", protect, authorize("admin"), deleteJobPosition);

export default router;
