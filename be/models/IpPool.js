const mongoose = require("mongoose");

const IpPool = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  router: { type: mongoose.Schema.Types.ObjectId, ref: "Router" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("IpPool", IpPool);
