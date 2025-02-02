const express = require("express");
const router = express.Router();
const User = require("../models/User");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const dbStatus = mongoose.connection.readyState;

  if (dbStatus !== 1) {
    return res.json({
      status: false,
      message: "Database not connected",
      code: "ERROR",
    });
  }

  try {
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      return res.json({
        status: false,
        message: "User not found",
        code: "FIRST_TIME",
      });
    }

    res.json({ status: true, message: "Database connected", code: "OK" });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error checking admin user",
      code: "ERROR",
      error: error.message,
    });
  }
});

router.get("/if/first-time", async (req, res) => {
  const userAdmin = await User.findOne({ role: "admin" });

  if (userAdmin) {
    return res.json({
      status: false,
      message: "No first time",
      code: "ERROR",
    });
  } else {
    return res.json({
      status: true,
      message: "First time",
      code: "OK",
    });
  }
});

module.exports = router;
