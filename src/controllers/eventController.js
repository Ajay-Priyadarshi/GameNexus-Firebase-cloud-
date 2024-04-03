import moment from 'moment-timezone';
import { EventModel as Event } from '../models/Event.js';
import { UserModel as User } from '../models/User.js';

export const eventOrg = async (req, res) => {
    try {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        const myEvents = await Event.find({ User_ID: userId });

        res.render('eventPageOrg', { user, myEvents });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const eventUsr = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('User_ID', 'username userPhoto _id')
            .exec();
        res.render('eventPageUsr', { events });
    } catch (error) {
        console.error('Error fetching plans:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const addEvent = (req, res) => {
    res.render('addEvent');
}

export const createEvent = async (req, res) => {
    const User_ID = req.session.userId;
    const { Event_Name, Price, Event_Start_Date, Event_End_Date, Registration_Link } = req.body;
    const newEvent = new Event({
        User_ID,
        Event_Name,
        Price,
        Event_Start_Date,
        Event_End_Date,
        Registration_Link,
        Event_Timestamp: moment.tz('Asia/Kolkata').format(),
    });
    try {
        await newEvent.save();

        res.send(`
            <script>
                alert('Event created successfully!');
                window.location.href = '/events/org';
            </script>
        `);;
    } catch (error) {
        console.error('Error adding plan:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const showEditEventForm = async (req, res) => {
    const eventId = req.params.eventId;

    try {
        const event = await Event.findById(eventId);
        res.render('editEvent', { event });
    } catch (error) {
        console.error('Error fetching plan for edit:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const editEvent = async (req, res) => {
    const eventId = req.params.eventId;
    const { Event_Name, Price, Event_Start_Date, Event_End_Date, Registration_Link } = req.body;

    try {
        await Event.findByIdAndUpdate(eventId, {
            Event_Name,
            Price,
            Event_Start_Date,
            Event_End_Date,
            Registration_Link,
        });
        return res.send(`
            <script>
                alert('Event updated successfully!');
                window.location.href = '/events/org';
            </script>
        `);
    } catch (error) {
        console.error('Error editing plan:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const deleteEvent = async (req, res) => {
    const eventId = req.params.eventId;

    try {
        await Event.findByIdAndDelete(eventId);
        res.send(`
            <script>
                alert('Event deleted successfully!');
                window.location.href = '/events/org';
            </script>
        `);
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Internal Server Error');
    }
}