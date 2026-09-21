const express = require('express');
const router = express.Router();
const { sendSingleSms, broadcastAlert, getSmsLogs, getSmsTemplates } = require('../controllers/smsController');
const { authenticateToken } = require('../middleware/auth');

router.post('/send', authenticateToken, sendSingleSms);
router.post('/broadcast', authenticateToken, broadcastAlert);
router.get('/logs', getSmsLogs);
router.get('/templates', getSmsTemplates);

module.exports = router;
