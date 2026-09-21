const db = require('../config/db');
const { sendSms, broadcastVillageAlert, TEMPLATES } = require('../services/smsVoiceService');
const { getHelplineConfig } = require('../config/helpline');

const sendSingleSms = (req, res) => {
  const { recipientPhone, recipientName, language = 'hi', templateKey, templateData } = req.body;

  if (!recipientPhone) {
    return res.status(400).json({ success: false, message: 'Recipient phone is required.' });
  }

  const result = sendSms({
    recipientPhone,
    recipientName,
    language,
    templateKey,
    templateData
  });

  return res.json(result);
};

const broadcastAlert = (req, res) => {
  const { villageId, crop, disease, riskScore, customMessage } = req.body;

  if (!villageId) {
    return res.status(400).json({ success: false, message: 'Village ID is required for broadcast.' });
  }

  const result = broadcastVillageAlert({
    villageId,
    crop,
    disease,
    riskScore,
    customMessage
  });

  return res.json({
    success: true,
    message: `Broadcast delivered to ${result.totalDispatched} farmers in sector.`,
    ...result
  });
};

const getSmsLogs = (req, res) => {
  const { phone } = req.query;
  let logs = db.get('sms_logs');

  if (phone) {
    logs = logs.filter((l) => l.recipientPhone === phone);
  }

  return res.json({
    success: true,
    count: logs.length,
    helpline: getHelplineConfig().number,
    logs
  });
};

const getSmsTemplates = (req, res) => {
  const sampleData = {
    crop: 'Cotton',
    village: 'Pimpalgaon',
    disease: 'Pink Bollworm',
    riskScore: 85,
    helpline: getHelplineConfig().number,
    prescription: 'Profenofos 50% EC @ 30ml/10L water',
    humidity: 88
  };

  const rendered = {};
  Object.keys(TEMPLATES).forEach((key) => {
    rendered[key] = {
      en: TEMPLATES[key].en(sampleData),
      hi: TEMPLATES[key].hi(sampleData),
      mr: TEMPLATES[key].mr(sampleData)
    };
  });

  return res.json({
    success: true,
    helpline: getHelplineConfig().number,
    templates: rendered
  });
};

module.exports = {
  sendSingleSms,
  broadcastAlert,
  getSmsLogs,
  getSmsTemplates
};
