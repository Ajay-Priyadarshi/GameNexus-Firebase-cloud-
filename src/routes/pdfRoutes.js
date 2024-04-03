// pdfRoutes.js
import express from 'express';
import { userAnalytics, ageAnalytics, genderAnalytics, postAnalytics, postUserAnalytics, salesAnalytics } from '../controllers/pdfController.js';

const router = express.Router();

router.get('/userAnalytics', userAnalytics);
router.get('/ageAnalytics', ageAnalytics);
router.get('/genderAnalytics', genderAnalytics);
router.get('/postAnalytics', postAnalytics);
router.get('/postUserAnalytics', postUserAnalytics);
router.get('/salesAnalytics', salesAnalytics);

export default router;
