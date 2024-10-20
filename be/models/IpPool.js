const mongoose = require("mongoose");

const IpPool = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("IpPool", IpPool);
