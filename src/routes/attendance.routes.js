import express from 'express';
import { checkIn, checkOut, getAttendance } from '../controllers/attendance.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/check-in', protect, checkIn);
router.put('/check-out', protect, checkOut);
router.get('/', protect, getAttendance);

export default router;
