const express = require('express');
const router = express.Router();
const { simulateIvrStep, triggerMissedCall, getCallLogs, getIvrFlowSchema } = require('../controllers/ivrController');

router.post('/simulate-step', simulateIvrStep);
router.post('/missed-call', triggerMissedCall);
router.get('/logs', getCallLogs);
router.get('/flow-schema', getIvrFlowSchema);

module.exports = router;
