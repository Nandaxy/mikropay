const express = require("express");
const router = express.Router();

const { getNameHotspotProfile, orderVoucher } = require("../controllers/product");

router.get("/hotspot/profile/:slug", getNameHotspotProfile);

router.get("/order/voucher/:slug", orderVoucher )

module.exports = router;
