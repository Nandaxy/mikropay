const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require("../../middleware/auth");
const {
  addUserHotspot,
  addBatchUserHotspot,
} = require("../../controllers/admin/userHotspot");

router.post(
  "/admin/hotspot/user/add",
  authenticateToken,
  authorizeAdmin,
  addUserHotspot
);

router.post(
  "/admin/hotspot/user/batch/add",
  authenticateToken,
  authorizeAdmin,
  addBatchUserHotspot
);

module.exports = router;
