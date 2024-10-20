const mongoose = require("mongoose");

const PppoeProfile = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    profile: { type: String, unique: true },
    rateLimit: { type: String },
    price: { type: Number },
    remoteAddress: { type: String },
    localAddress: { type: String },
    onlyOne: { type: String },
    exp : { type: String},
    router: { type: mongoose.Schema.Types.ObjectId, ref: "Router" },
    createdAt: { type: Date, default: Date.now },

});

module.exports = mongoose.model("PppoeProfile", PppoeProfile);
