const express = require('express');
const router = express.Router();
const {
  getOfficerDashboardStats,
  getPendingVerifications,
  getAlerts,
  createManualAlert
} = require('../controllers/officerController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/stats', authenticateToken, getOfficerDashboardStats);
router.get('/pending-verifications', authenticateToken, getPendingVerifications);
router.get('/alerts', getAlerts);
router.post('/create-alert', authenticateToken, authorizeRoles('agri_officer', 'admin'), createManualAlert);

module.exports = router;
