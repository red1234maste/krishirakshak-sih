const express = require('express');
const router = express.Router();
const { login, demoLogin, register, getMe, updateLanguage } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', login);
router.post('/demo-login', demoLogin);
router.post('/register', register);
router.get('/me', authenticateToken, getMe);
router.put('/language', authenticateToken, updateLanguage);

module.exports = router;
