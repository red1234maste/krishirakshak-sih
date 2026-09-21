const express = require('express');
const router = express.Router();
const { getConfig, updateHelpline, resetDatabase, getCrops } = require('../controllers/configController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', getConfig);
router.get('/helpline', getConfig);
router.put('/helpline', authenticateToken, authorizeRoles('admin'), updateHelpline);
router.post('/reset-db', authenticateToken, authorizeRoles('admin'), resetDatabase);
router.get('/crops', getCrops);

module.exports = router;
