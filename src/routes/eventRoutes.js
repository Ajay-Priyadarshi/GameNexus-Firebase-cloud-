import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { eventOrg, eventUsr, addEvent, createEvent, showEditEventForm, editEvent, deleteEvent } from '../controllers/eventController.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get('/org', eventOrg);
router.get('/usr', eventUsr);

router.get('/add', addEvent);
router.post('/create', createEvent);
router.get('/edit/:eventId', showEditEventForm);
router.post('/editF/:eventId', editEvent);
router.get('/delete/:eventId', deleteEvent);

router.get('/usr/usr_options', (req, res) => {
    res.sendFile(path.join(__dirname, '../../static/Event_options.html'));
});
router.get('/org/org_options', (req, res) => {
    res.sendFile(path.join(__dirname, '../../static/Event_options.html'));
});

export default router;
