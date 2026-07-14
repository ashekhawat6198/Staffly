import express from "express";
const router=express.Router();

import {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
  getEmployeeAttendance 
} from "../controllers/attendanceController.js"

import {protect,authorize} from "../middlewares/authMiddleware.js"


router.post('/checkin', protect, checkIn);
router.put('/checkout', protect, checkOut);
router.get('/me', protect, getMyAttendance);
router.get('/', protect, authorize('admin', 'hr', 'manager'), getAllAttendance);
router.get('/:employeeId', protect, authorize('admin', 'hr', 'manager'), getEmployeeAttendance);

export default router;