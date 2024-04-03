// Content_tbl

import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  User_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Data_tbl', required: true }, //content creator id
  Content_Type: { type: String, default: 'image' },
  Content_URL: { type: String, required: true },
  Content_Description: { type: String, required: true },
  Like_Count: { type: Number, default: 0 }, //add to dfd
  Comment_Count: { type: Number, default: 0 }, //add to dfd
  Content_TimeStamp: { type: Date, default: Date.now },
});

const ContentModel = mongoose.model('Content_tbl', contentSchema, 'Content_tbl');

export { ContentModel };
