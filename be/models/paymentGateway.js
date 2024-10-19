const mongoose = require('mongoose');

const PaymentGateway = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    endpoint: { type: String }, 
    apiKey: { type: String},
    privateKey: { type: String },
    merchantCode: { type: String },
});

module.exports = mongoose.model('PaymentGateway', PaymentGateway);
