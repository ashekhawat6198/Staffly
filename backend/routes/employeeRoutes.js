import express from "express";
const router=express.Router();

import{
    createEmployee,
  getEmployees,
  getEmployeeById,
  getMyProfile,
  updateEmployee,
  deactivateEmployee
} from "../controllers/employeeController.js"
import { authorize,protect } from "../middlewares/authMiddleware.js";

router.get('/me', protect, getMyProfile);

router.post('/', protect, authorize('admin', 'hr'), createEmployee);
router.get('/', protect, authorize('admin', 'hr', 'manager'), getEmployees);
router.get('/:id', protect, getEmployeeById);
router.put('/:id', protect, authorize('admin', 'hr'), updateEmployee);
router.delete('/:id', protect, authorize('admin'), deactivateEmployee);

export default router;
