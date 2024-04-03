// routes/userAnalyticsRoutes.js
import express from 'express';
import { showAnalytics, user ,post } from '../controllers/postAnalyticsController.js';

const router = express.Router();

router.get('/', showAnalytics);

router.get('/user/:username', user);

router.get('/post', post);

export default router;
