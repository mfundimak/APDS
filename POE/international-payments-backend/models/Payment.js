// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customerId: {
    fullName: { type: String, required: true },
    accountNumber: { type: String, required: true },
  },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  swiftCode: { type: String, required: true },
  recipientAccount: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model('Payment', paymentSchema);
