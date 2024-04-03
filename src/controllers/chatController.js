// chatController.js

import mongoose from 'mongoose';
import moment from 'moment-timezone';
import { ChatModel as Chat } from '../models/Chat.js';
import { UserModel as User } from '../models/User.js';

export const allChats = async (req, res) => {
  const userId = req.session.userId;

  try {
    // Find distinct conversations involving the logged-in user
    const distinctConversations = await Chat.aggregate([
      {
        $match: {
          $or: [
            { Sender_ID: new mongoose.Types.ObjectId(userId) },
            { Reciever_ID: new mongoose.Types.ObjectId(userId) },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          userId: {
            $cond: [
              { $eq: ['$Sender_ID', new mongoose.Types.ObjectId(userId)] },
              '$Reciever_ID',
              '$Sender_ID',
            ],
          },
        },
      },
      { $group: { _id: '$userId', latestMessage: { $max: '$Message_Timestamp' } } },
    ]);

    // Get user details for each distinct conversation
    const recentChats = await Promise.all(
      distinctConversations.map(async (conversation) => {
        try {
          const user = await User.findById(conversation._id);
          if (!user) {
            console.log(`User not found for ID: ${conversation._id}`);
            return null;
          }
    
          const latestMessage = await Chat.findOne({
            $or: [
              { Sender_ID: userId, Reciever_ID: conversation._id },
              { Sender_ID: conversation._id, Reciever_ID: userId },
            ],
          })
            .sort({ Message_Timestamp: -1 }) // Sort by timestamp in descending order
            .limit(1);
    
          return {
            user,
            latestMessage,
          };
        } catch (error) {
          console.error(`Error fetching chat for user ID ${conversation._id}:`, error);
          return null;
        }
      })
    );
    
    // Filter out null values (users not found or errors)
    const validRecentChats = recentChats.filter((chat) => chat !== null);
    
    res.render('allChats', { recentChats: validRecentChats, moment });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


export const personalChats = async (req, res) => {
  const guestId = req.params.userId;
  const userId = req.session.userId;

  const user = await User.findById(userId);
  const guestUser = await User.findById(guestId);
  const chats = await Chat.find({
    $or: [
      { Sender_ID: userId, Reciever_ID: guestId },
      { Sender_ID: guestId, Reciever_ID: userId },
    ],
  }).populate('Sender_ID').populate('Reciever_ID').sort({ Message_Timestamp: 1 });

  res.render('personalChat', { guestUser, user, chats});
}

export const sendMessage = async (req, res) => {
  const { Message_Description, guestId } = req.body;
  const userId = req.session.userId;

  const newMessage = new Chat({
    Sender_ID: userId,
    Reciever_ID: guestId,
    Message_Description: Message_Description,
    Message_Status: 'sent',
    Message_Timestamp: moment().tz('Asia/Kolkata').toDate(),
  });

  await newMessage.save();

  res.redirect(`/chat/personal/${guestId}`);
}
