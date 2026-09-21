const db = require('../config/db');
const { getHelplineConfig, updateHelplineConfig } = require('../config/helpline');

const getConfig = (req, res) => {
  return res.json({
    success: true,
    helpline: getHelplineConfig(),
    system: {
      appName: 'KrishiRakshak',
      theme: 'Agriculture & FoodTech SIH 2026',
      problemStatement: 'SIH26131',
      version: '2.0-PROTOTYPE',
      languages: [
        { code: 'en', label: 'English', native: 'English' },
        { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
        { code: 'mr', label: 'Marathi', native: 'मराठी' }
      ],
      defaultLanguage: 'hi',
      telecomAdapter: 'MOCK_IVR_SMS_STATE_MACHINE'
    }
  });
};

const updateHelpline = (req, res) => {
  const { number, name, timings } = req.body;
  if (!number) {
    return res.status(400).json({ success: false, message: 'Helpline number is required.' });
  }

  const updated = updateHelplineConfig({
    number,
    name: name || 'Kisan Suraksha Helpline',
    timings: timings || '24x7 All Days'
  });

  return res.json({
    success: true,
    message: `Helpline updated to ${updated.number}.`,
    helpline: updated
  });
};

const resetDatabase = (req, res) => {
  const result = db.reset();
  return res.json({
    success: true,
    ...result
  });
};

const getCrops = (req, res) => {
  const crops = db.get('crops');
  return res.json({
    success: true,
    count: crops.length,
    crops
  });
};

module.exports = {
  getConfig,
  updateHelpline,
  resetDatabase,
  getCrops
};
