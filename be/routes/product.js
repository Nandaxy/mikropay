const express = require("express");
const router = express.Router();
// const { getInvoice } = require("../controllers/invoice");
const { getNameHotspotProfile } = require("../controllers/product");
//
router.get("/hotspot/profile/:slug", getNameHotspotProfile);

module.exports = router;
