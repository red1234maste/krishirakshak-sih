const express = require('express');
const router = express.Router();
const { getAnalyticsTrends } = require('../controllers/analyticsController');

router.get('/trends', getAnalyticsTrends);

module.exports = router;
