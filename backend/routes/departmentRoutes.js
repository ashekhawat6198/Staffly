import express from "express";
const router=express.Router();

import {
    createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js"

import {protect,authorize} from "../middlewares/authMiddleware.js"


router.post('/',protect,authorize('admin','hr'),createDepartment);
router.get('/',protect,getAllDepartments);
router.get('/:id',protect,getDepartmentById);
router.put('/:id', protect, authorize('admin', 'hr'), updateDepartment);
router.delete('/:id', protect, authorize('admin'), deleteDepartment);


export default router;