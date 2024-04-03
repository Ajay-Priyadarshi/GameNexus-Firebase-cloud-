// authRoutes.js
import express from 'express';
import { login, register, selectPlan, forgotPasswordStep1, forgotPasswordStep2 } from "../controllers/authController.js";
import multer from 'multer';
import path from 'path';
import { storage } from '../../config/firebase.config.js'; 
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), 
});

router.get('/reg', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', '../../../static/register.html'));
});

router.post('/register', upload.single('photo'), async (req, res, next) => {
  try {
    const { username, email, password, accountType, bio, securityQuestion, answer, age, gender } = req.body;

    let downloadURL;
    let filename;

    if (req.file) {
      filename = `${Date.now()}-${req.file.originalname}`;
      const storageRef = ref(storage, `profileImages/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, req.file.buffer);
      await uploadTask;
      downloadURL = await getDownloadURL(storageRef);
    } else {
      downloadURL = 'https://firebasestorage.googleapis.com/v0/b/gamenexus-d6fb6.appspot.com/o/profileImages%2Fdemo.jpg?alt=media&token=7b2783bb-315d-4133-b6b7-9e32e61aefe9';
    }

    await register(req, res, next, { 
      username, email, password, accountType, bio, 
      securityQuestion, answer, age, gender, 
      userPhoto: downloadURL
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});



router.post('/select-plan', selectPlan);
router.post('/login', login);
router.post('/forgot-password-step1', forgotPasswordStep1);
router.post('/forgot-password-step2', forgotPasswordStep2);

export default router;
