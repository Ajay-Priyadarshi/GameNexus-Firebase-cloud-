// postRoutes.js
import express from 'express';
import multer from 'multer';
import { storage } from '../../config/firebase.config.js'; 
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { newPost, createPost, deletePost } from '../controllers/postController.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), 
}).single('media');

router.get('/new', newPost);

router.post('/create', upload, async (req, res, next) => {
  try {
    const { User_ID, Content_Description } = req.body; 

    let downloadURL = null;
    let Content_Type = null;

    if (req.file) {
      Content_Type = req.file.mimetype.startsWith('image') ? 'image' : 'video';
      const filename = `${Date.now()}-${req.file.originalname}`;
      const storageRef = ref(storage, `posts/${filename}`); 
      const uploadTask = uploadBytesResumable(storageRef, req.file.buffer);
      await uploadTask;
      downloadURL = await getDownloadURL(storageRef);
    }

    await createPost(req, res, next, { 
      User_ID, 
      Content_Description, 
      Content_Type,
      Content_URL: downloadURL,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

router.get('/delete/:postId', deletePost);

export default router;
