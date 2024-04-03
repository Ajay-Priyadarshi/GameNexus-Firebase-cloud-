// adminRoutes.js

import express from 'express';
import { adminDashboard } from '../controllers/adminController.js';

const router = express.Router();

// Admin Dashboard
router.get('/dashboard', adminDashboard);

export default router;
