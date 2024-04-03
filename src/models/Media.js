// Media_tbl

import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema({
  User_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Data_tbl', required: true },
  Media_Type: { type: String, required: true },
  Media_URL: { type: String, required: true },
  Upload_Timestamp: { type: Date, default: Date.now },
});

const MediaModel = mongoose.model('Media_tbl', mediaSchema, 'Media_tbl');

export { MediaModel };
