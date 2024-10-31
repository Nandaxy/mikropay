const express = require("express");
const router = express.Router();
const { generateVouchers } = require("../controllers/voucher");

router.post("/admin/hotspot/voucher/generate", generateVouchers);

module.exports = router;
