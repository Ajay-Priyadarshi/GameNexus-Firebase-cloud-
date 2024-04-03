// searchRoutes.js
import express from "express";
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { showFeed } from "../controllers/feedController.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/', showFeed);

router.get('/feed_options', (req, res) => {
    res.sendFile(path.join(__dirname, '../../static/Post_options.html'));
});

export default router;
