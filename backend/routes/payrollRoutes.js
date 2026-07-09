import express from "express";
const router=express.Router();

import {
    generatePayroll,
  getAllPayroll,
  getMyPayroll,
  getPayrollById,
  updatePayrollStatus,
  deletePayroll
} from "../controllers/payrollController.js"

const { protect, authorize } = require('../middleware/authMiddleware');


// IMPORTANT: '/me' must come before '/:id', otherwise Express treats
// "me" as an :id value and the route won't work as expected.

router.post('/generate', protect, authorize('admin', 'hr'), generatePayroll);
router.get('/me', protect, getMyPayroll);
router.get('/', protect, authorize('admin', 'hr'), getAllPayroll);
router.get('/:id', protect, getPayrollById);
router.put('/:id/status', protect, authorize('admin', 'hr'), updatePayrollStatus);
router.delete('/:id', protect, authorize('admin'), deletePayroll);

module.exports = router;