// searchRoutes.js
import express from "express";
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { search } from "../controllers/searchController.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/', search);

router.get('/search_options', (req, res) => {
    res.sendFile(path.join(__dirname, '../../static/Search_options.html'));
});

export default router;
