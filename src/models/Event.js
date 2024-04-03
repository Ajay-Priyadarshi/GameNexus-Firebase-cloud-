// Event_Data_tbl

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  User_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Data_tbl', required: true },
  Event_Name: { type: String, required: true },
  Price: { type: Number, required: true },
  Event_Start_Date: { type: Date, required: true },
  Event_End_Date: { type: Date, required: true },
  Registration_Link: { type: String, required: true },
  Event_Timestamp: { type: Date, default: Date.now },
});

const EventModel = mongoose.model('Event_Data_tbl', eventSchema, 'Event_Data_tbl');

export { EventModel };
