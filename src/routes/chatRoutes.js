import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { allChats, personalChats, sendMessage } from '../controllers/chatController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/', allChats);
router.get('/personal/:userId', personalChats);
router.post('/send', sendMessage);

router.get('/chat_options', (req, res) => {
    res.sendFile(path.join(__dirname, '../../static/Chat_options.html'));
});

export default router;
