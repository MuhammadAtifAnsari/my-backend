import express from 'express';
import { runPayroll, getPayroll, finalizePayroll } from '../controllers/payroll.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPayroll)
  .post(protect, authorize('Admin', 'HR'), runPayroll);

router.put('/:id/finalize', protect, authorize('Admin'), finalizePayroll);

export default router;
