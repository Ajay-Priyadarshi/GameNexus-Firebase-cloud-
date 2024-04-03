// routes/userAnalyticsRoutes.js
import express from 'express';
import { showAnalytics } from '../controllers/salesAnalyticsController.js';

const router = express.Router();

router.get('/', showAnalytics);



export default router;
