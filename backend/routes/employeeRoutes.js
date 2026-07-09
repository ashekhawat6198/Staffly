import express from "express";
const router=express.Router();

const{
    createEmployee,
  getEmployees,
  getEmployeeById,
  getMyProfile,
  updateEmployee,
  deactivateEmployee
}

const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyProfile);

router.post('/', protect, authorize('admin', 'hr'), createEmployee);
router.get('/', protect, authorize('admin', 'hr', 'manager'), getEmployees);
router.get('/:id', protect, getEmployeeById);
router.put('/:id', protect, authorize('admin', 'hr'), updateEmployee);
router.delete('/:id', protect, authorize('admin'), deactivateEmployee);

module.exports = router;
