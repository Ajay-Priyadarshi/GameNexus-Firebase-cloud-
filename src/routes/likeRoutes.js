import express from "express";
import { likeContent } from "../controllers/likeController.js";

const router = express.Router(); 

router.get('/:postId/', likeContent);
router.get('/:postId/:userId', likeContent);

export default router;