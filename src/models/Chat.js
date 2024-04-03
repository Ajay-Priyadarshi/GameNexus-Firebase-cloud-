// Chat_tbl

import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  Sender_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Data_tbl', required: true },
  Reciever_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Data_tbl', required: true },
  Message_Description: { type: String, required: true },
  Message_Status: { type: String, required: true },
  Message_Timestamp: { type: Date, default: Date.now },
});

const ChatModel = mongoose.model('Chat_tbl', chatSchema, 'Chat_tbl');

export { ChatModel };
