const db = require('../config/db');
const { calculatePestRisk, evaluateVillageRisk } = require('../services/riskEngine');
const { broadcastVillageAlert } = require('../services/smsVoiceService');
const { getHelplineConfig } = require('../config/helpline');

const evaluateRiskParams = (req, res) => {
  const {
    temperature = 28,
    humidity = 85,
    rainfall = 15,
    leafWetnessHours = 8,
    satelliteNdvi = 0.56,
    crop = 'Cotton',
    cropStage = 'Flowering & Boll Formation',
    verifiedReportsInRadius = 2
  } = req.body;

  const result = calculatePestRisk({
    temperature: parseFloat(temperature),
    humidity: parseFloat(humidity),
    rainfall: parseFloat(rainfall),
    leafWetnessHours: parseFloat(leafWetnessHours),
    satelliteNdvi: parseFloat(satelliteNdvi),
    crop,
    cropStage,
    verifiedReportsInRadius: parseInt(verifiedReportsInRadius)
  });

  return res.json({
    success: true,
    evaluation: result,
    helpline: getHelplineConfig().number
  });
};

const getVillageRiskAssessments = async (req, res) => {
  const villages = db.get('villages');
  const assessments = await Promise.all(villages.map((v) => evaluateVillageRisk(v.id)));

  return res.json({
    success: true,
    assessments,
    helpline: getHelplineConfig().number
  });
};

const triggerOutbreakSimulation = (req, res) => {
  const { villageId = 'vil-01', crop = 'Cotton', disease = 'Pink Bollworm & Bacterial Blight' } = req.body;
  const village = db.findById('villages', villageId);

  if (!village) {
    return res.status(404).json({ success: false, message: 'Village not found.' });
  }

  // Elevate village risk to HIGH
  db.update('villages', villageId, {
    riskLevel: 'HIGH',
    riskScore: 88,
    weatherAlert: 'Simulated high-humidity surge triggering urgent pest outbreak warning'
  });

  // Create new active alert
  const alert = db.create('alerts', {
    villageId,
    crop,
    diseaseOrPest: `${disease} Outbreak Alert`,
    riskLevel: 'HIGH',
    riskScore: 88,
    triggerReason: 'Automated Early-Warning Engine: Humidity 88% + Multi-plot symptom correlation',
    sentToFarmerCount: village.farmerCount || 400,
    channelsDispatched: ['SMS', 'VOICE_IVR', 'AGRI_MITRA_BROADCAST'],
    broadcastDate: new Date().toISOString(),
    helplineIncluded: getHelplineConfig().number,
    status: 'ACTIVE'
  });

  // Auto-send SMS to all registered farmers in that village
  const broadcastResult = broadcastVillageAlert({
    villageId,
    crop,
    disease,
    riskScore: 88
  });

  return res.json({
    success: true,
    message: `Simulated outbreak triggered for ${village.name}. Real-time high-risk alert generated and SMS queued.`,
    alert,
    broadcastResult
  });
};

module.exports = {
  evaluateRiskParams,
  getVillageRiskAssessments,
  triggerOutbreakSimulation
};
