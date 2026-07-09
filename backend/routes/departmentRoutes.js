import express from "express";
const router=express.Router();

import {
    createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js"

import {protect,authorize} from "../middlewares/authMiddleware.js"


router.post('/',protect,authorize('admin','hr'),createDepartment);
router.get('/',protect,getDepartments);
router.get('/:id',protect,getDepartmentById);
router.put('/:id', protect, authorize('admin', 'hr'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);


module.exports = router;