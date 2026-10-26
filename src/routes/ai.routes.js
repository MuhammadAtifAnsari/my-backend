import express from 'express';
import { processAIQuery } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/query', protect, processAIQuery);

export default router;