// Payment_tbl

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  User_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'User_Data_tbl', required: true },
  Transaction_ID: { type: String},
  Amount: { type: Number, required: true },
  Payment_Method: { type: String, required: true, default: 'UPI'},
  Payment_Status: { type: String, required: true, default: 'Success'},
  Payment_Timestamp: { type: Date, default: Date.now },
  Plan_ID: { type: mongoose.Schema.Types.ObjectId, ref: 'Plans_tbl', required: true },
});

const PaymentModel = mongoose.model('Payment_tbl', paymentSchema, 'Payment_tbl');

export { PaymentModel };
