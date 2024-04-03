// commentRoutes.js
import express from "express";
import { getPost, getComments, createComment } from "../controllers/commentController.js";

const router = express.Router();

router.get('/postSection/:postId', getPost);
router.get('/commentSection/:postId', getComments);
router.post('/create', createComment);

export default router;
