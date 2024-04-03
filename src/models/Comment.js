// Comment_tbl

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  Content_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Content_tbl', required: true }, //post ka id
  User_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Data_tbl', required: true }, //comment karne wale ka id
  Comment_Description: { type: String, required: true },
  Comment_Timestamp: { type: Date, default: Date.now },
});

const CommentModel = mongoose.model('Comment_tbl', commentSchema, 'Comment_tbl');

export { CommentModel };
