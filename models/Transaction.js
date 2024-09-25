const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  reference: { type: String, required: true },
  merchant_ref: { type: String, required: true },
  profile: { type: String, required: true },
  payment_method: { type: String, required: true },
  amount: { type: Number, required: true },
  checkout_url: { type: String, required: true },
  status: { type: String, required: true },
  mac: { type: String },
  customer_name: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_phone: { type: String, required: true },
  expired_time: { type: Number, required: true},
  instructions: {type: Object},
  qr_string: {type: String},
  qr_url: {type: String},
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
