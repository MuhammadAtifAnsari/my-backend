import express from 'express';
import { applyLeave, getLeaves, updateLeaveStatus } from '../controllers/leave.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getLeaves)
  .post(protect, applyLeave);

router.put('/:id/status', protect, authorize('Admin', 'HR'), updateLeaveStatus);

export default router;
