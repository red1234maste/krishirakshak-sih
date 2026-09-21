const express = require('express');
const router = express.Router();
const {
  evaluateRiskParams,
  getVillageRiskAssessments,
  triggerOutbreakSimulation
} = require('../controllers/riskController');

router.post('/evaluate', evaluateRiskParams);
router.get('/villages', getVillageRiskAssessments);
router.post('/simulate-outbreak', triggerOutbreakSimulation);

module.exports = router;
