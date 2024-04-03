// profileRoutes.js
import express from 'express';
import multer from 'multer';
import { UserModel as User } from '../models/User.js';
import { storage } from '../../config/firebase.config.js'; // Import Firebase storage configuration
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { showProfile, editProfile, updateProfile, del, deleteProfile, getUserProfile } from '../controllers/profileController.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), 
});

router.get('/', showProfile);

router.get('/editProfile', editProfile);

router.post('/updateProfile', upload.single('userPhoto'), async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    const {bio, requirements} = req.body;
    let downloadURL = user.userPhoto;

    if (req.file) {
      const filename = `${Date.now()}-${req.file.originalname}`;
      const storageRef = ref(storage, `profileImages/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, req.file.buffer);
      await uploadTask;
      downloadURL = await getDownloadURL(storageRef);
    }

    await updateProfile(req, res, next, {  
      bio, requirements,
      userPhoto: downloadURL
    });

  } catch (error) {
    console.error('Error during profile update:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

router.get('/del', del);
router.post('/delete', deleteProfile);

router.get('/profile_options', (req, res) => {
  res.render('profile_options'); 
});

router.get('/:userId', getUserProfile);

export default router;
