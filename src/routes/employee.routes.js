import express from 'express';
import {
  registerEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee, // 1. Import deleteEmployee controller
} from '../controllers/employee.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('Admin', 'HR'), getEmployees)
  .post(protect, authorize('Admin', 'HR'), registerEmployee);

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, authorize('Admin', 'HR'), updateEmployee)
  .delete(protect, authorize('Admin', 'HR'), deleteEmployee); // 2. Added DELETE route here

export default router;