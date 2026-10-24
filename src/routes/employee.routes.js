import express from 'express';
import {
  registerEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
} from '../controllers/employee.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, authorize('Admin', 'HR'), getEmployees)
  .post(protect, authorize('Admin', 'HR'), registerEmployee);

router.route('/:id')
  .get(protect, getEmployeeById)
  .put(protect, updateEmployee);

export default router;
