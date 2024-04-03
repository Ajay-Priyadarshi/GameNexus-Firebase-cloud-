// Follow_Request_tbl

import mongoose from 'mongoose';

const followRequestSchema = new mongoose.Schema({
  User_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Data_tbl', required: true },
  Request_Status: { type: String, required: true },
  Follower_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Data_tbl', required: true },
  Follow_Timestamp: { type: Date, default: Date.now },
});

const FollowRequestModel = mongoose.model('Follow_Request_tbl', followRequestSchema, 'Follow_Request_tbl');

export { FollowRequestModel };
