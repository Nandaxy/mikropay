const express = require("express");
const router = express.Router();
const User = require("../../models/User");

router.post("/user/first-time", async (req, res) => {

    console.log("Test");
  const userAdmin = await User.findOne({ role: "admin" });

  if (userAdmin) {
    return res.json({
      status: false,
      message: "Pengguna sudah ada",
      code: "ERROR",
    });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({
      status: false,
      message: "Username dan password diperlukan",
      code: "ERROR",
    });
  }

  if (username.length < 4 || password.length < 4) {
    return res.json({
      status: false,
      message: "Username dan password harus minimal 4 karakter",
      code: "ERROR",
    });
  }

  if (username.length > 30 || password.length > 50) {
    return res.json({
      status: false,
      message: "Username dan password harus kurang dari 30 dan 50 karakter",
      code: "ERROR",
    });
  }

  const user = new User({
    username,
    password,
    email: `${username}@mikropay.com`,
    role: "admin",
  });

  try {
    await user.save();
    return res.json({
      status: true,
      message: "Pengguna berhasil dibuat",
      code: "OK",
    });
  } catch (error) {
    return res.json({
      status: false,
      message: "Kesalahan saat membuat pengguna",
      code: "ERROR",
      error: error.message,
    });
  }
});

module.exports = router;
