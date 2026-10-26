import express from 'express';
import { 
  applyLeave, 
  getLeaves, 
  updateLeaveStatus, 
  getLeaveTypes 
} from '../controllers/leave.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// 1. Leave Types Route (Must be placed before any parameterized routes)
router.get('/types', protect, getLeaveTypes);

// 2. Leave Applications Routes
router.route('/')
  .get(protect, getLeaves)
  .post(protect, applyLeave);

// 3. Update Leave Status Route
router.put('/:id/status', protect, authorize('Admin', 'HR'), updateLeaveStatus);

export default router;