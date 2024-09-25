const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    endpoint: { type: String, required: true, unique: true }, 
    apiKey: { type: String, required: true },
    privateKey: { type: String, required: true },
    merchantCode: { type: String, required: true },
    router: { type: mongoose.Schema.Types.ObjectId, ref: 'Router' }
});

module.exports = mongoose.model('Setting', settingSchema);
