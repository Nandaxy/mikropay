const express = require('express');
const router = express.Router();
const { createPayment } = require('../controllers/bayar');

router.post('/', createPayment);

module.exports = router;
