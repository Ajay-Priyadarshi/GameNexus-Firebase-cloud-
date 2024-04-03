// Like_tbl
import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  User_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Data_tbl', required: true }, //user who liked the content
  Content_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Content_tbl', required: true },
  Like_Timestamp: { type: Date, default: Date.now },
});

const LikeModel = mongoose.model('Like_tbl', likeSchema, 'Like_tbl');

export { LikeModel };
