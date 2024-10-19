const express = require("express");
const router = express.Router();
const { getInvoice } = require("../controllers/invoice");

router.get("/invoice/:id", getInvoice);
router.post("/invoice/:id", getInvoice);

module.exports = router;
