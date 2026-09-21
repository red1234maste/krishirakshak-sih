const express = require('express');
const router = express.Router();
const {
  getAllFarmers,
  registerOfflineFarmer,
  getFieldVisits,
  createFieldVisit
} = require('../controllers/farmerController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', getAllFarmers);
router.post('/register-offline', authenticateToken, authorizeRoles('agri_mitra', 'agri_officer', 'admin'), registerOfflineFarmer);
router.get('/field-visits', getFieldVisits);
router.post('/field-visits', authenticateToken, authorizeRoles('agri_mitra', 'agri_officer', 'admin'), createFieldVisit);

module.exports = router;
