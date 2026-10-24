import express from 'express';
import {
  getSettings,
  updateSettings,
  getDepartments,
  createDepartment,
  getLeaveTypes,
  createLeaveType,
  getHolidays,
  createHoliday,
} from '../controllers/org.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/settings').get(protect, getSettings).put(protect, authorize('Admin'), updateSettings);
router.route('/departments').get(protect, getDepartments).post(protect, authorize('Admin'), createDepartment);
router.route('/leave-types').get(protect, getLeaveTypes).post(protect, authorize('Admin'), createLeaveType);
router.route('/holidays').get(protect, getHolidays).post(protect, authorize('Admin'), createHoliday);

export default router;
