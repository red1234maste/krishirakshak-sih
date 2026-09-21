const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, phone: user.phone, preferredLanguage: user.preferredLanguage },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const login = (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ success: false, message: 'Phone number and password are required.' });
  }

  const user = db.findOne('users', { phone });
  if (!user) {
    return res.status(401).json({ success: false, message: 'User not registered with this mobile number.' });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials. Check password.' });
  }

  const token = generateToken(user);
  const farmerProfile = user.role === 'farmer' ? db.findOne('farmers', { userId: user.id }) : null;

  return res.json({
    success: true,
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage || 'hi',
      villageId: user.villageId,
      farmerProfile
    }
  });
};

const demoLogin = (req, res) => {
  const { role } = req.body;
  const validRoles = ['farmer', 'agri_mitra', 'agri_officer', 'admin'];

  if (!role || !validRoles.includes(role)) {
    return res.status(400).json({ success: false, message: 'Valid role is required (farmer, agri_mitra, agri_officer, admin).' });
  }

  const user = db.findOne('users', { role });
  if (!user) {
    return res.status(404).json({ success: false, message: `Demo user for role ${role} not found.` });
  }

  const token = generateToken(user);
  const farmerProfile = user.role === 'farmer' ? db.findOne('farmers', { userId: user.id }) : null;

  return res.json({
    success: true,
    message: `Logged in as demo ${role}.`,
    token,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage || 'hi',
      villageId: user.villageId,
      farmerProfile
    }
  });
};

const register = (req, res) => {
  const { name, phone, password, role = 'farmer', preferredLanguage = 'hi', villageId = 'vil-01', aadhaarLast4, primaryCrop, landSizeAcres } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ success: false, message: 'Name, mobile phone, and password are required.' });
  }

  const existing = db.findOne('users', { phone });
  if (existing) {
    return res.status(400).json({ success: false, message: 'Mobile number already registered in system.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const newUser = db.create('users', {
    name,
    phone,
    password: passwordHash,
    role,
    preferredLanguage,
    villageId
  });

  let farmerRecord = null;
  if (role === 'farmer') {
    farmerRecord = db.create('farmers', {
      userId: newUser.id,
      name,
      phone,
      villageId,
      preferredLanguage,
      hasSmartphone: true,
      aadhaarLast4: aadhaarLast4 || '0000',
      primaryCrop: primaryCrop || 'Cotton',
      landSizeAcres: landSizeAcres ? parseFloat(landSizeAcres) : 3.0,
      channelPreference: 'WEB_AND_SMS',
      registeredBy: 'self'
    });
  }

  const token = generateToken(newUser);

  return res.status(201).json({
    success: true,
    message: 'User account created successfully.',
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
      preferredLanguage: newUser.preferredLanguage,
      villageId: newUser.villageId,
      farmerProfile: farmerRecord
    }
  });
};

const getMe = (req, res) => {
  const user = req.user;
  const farmerProfile = user.role === 'farmer' ? db.findOne('farmers', { userId: user.id }) : null;

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      preferredLanguage: user.preferredLanguage || 'hi',
      villageId: user.villageId,
      farmerProfile
    }
  });
};

const updateLanguage = (req, res) => {
  const { preferredLanguage } = req.body;
  if (!['en', 'hi', 'mr'].includes(preferredLanguage)) {
    return res.status(400).json({ success: false, message: 'Language must be en, hi, or mr.' });
  }

  const updatedUser = db.update('users', req.user.id, { preferredLanguage });

  // Update in farmers table if farmer
  const farmer = db.findOne('farmers', { userId: req.user.id });
  if (farmer) {
    db.update('farmers', farmer.id, { preferredLanguage });
  }

  return res.json({
    success: true,
    message: `Language updated to ${preferredLanguage}.`,
    preferredLanguage: updatedUser.preferredLanguage
  });
};

module.exports = {
  login,
  demoLogin,
  register,
  getMe,
  updateLanguage
};
