const express = require('express');
const router = express.Router();
const callbackController = require('../controllers/callback');

router.post('/callback', callbackController);

module.exports = router;
