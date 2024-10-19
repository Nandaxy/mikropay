const mongoose = require("mongoose");

const HotspotProfile = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    profile: { type: String, unique: true },
    sessionTimeout: { type: String },
    sharedUsers: { type: String },
    rateLimit: { type: String },
    price: { type: Number },
    code: { type: String },
    router: { type: mongoose.Schema.Types.ObjectId, ref: "Router" }
});

module.exports = mongoose.model("HotspotProfile", HotspotProfile);
