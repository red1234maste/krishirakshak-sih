const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const {
  getAllReports,
  getReportById,
  runAiDiagnosis,
  createReport,
  verifyReport
} = require('../controllers/reportController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', getAllReports);
router.get('/:id', getReportById);
router.post('/ai-diagnose', upload.single('image'), runAiDiagnosis);
router.post('/', authenticateToken, upload.single('image'), createReport);
router.put('/:id/verify', authenticateToken, authorizeRoles('agri_officer', 'admin'), verifyReport);

module.exports = router;
