const db = require('../config/db');
const { getHelplineConfig } = require('../config/helpline');
const { broadcastVillageAlert } = require('../services/smsVoiceService');

const getOfficerDashboardStats = (req, res) => {
  const farmers = db.get('farmers');
  const farms = db.get('farms');
  const villages = db.get('villages');
  const reports = db.get('disease_reports');
  const alerts = db.get('alerts');
  const smsLogs = db.get('sms_logs');
  const ivrLogs = db.get('ivr_calls');

  const pendingCount = reports.filter((r) => r.officerVerificationStatus === 'PENDING_VERIFICATION').length;
  const verifiedCount = reports.filter((r) => r.officerVerificationStatus === 'VERIFIED').length;
  const highRiskVillages = villages.filter((v) => v.riskLevel === 'HIGH').length;
  const activeAlertsCount = alerts.filter((a) => a.status === 'ACTIVE').length;

  return res.json({
    success: true,
    stats: {
      totalFarmers: farmers.length,
      monitoredFarms: farms.length,
      monitoredVillages: villages.length,
      highRiskVillages,
      pendingVerifications: pendingCount,
      verifiedCases: verifiedCount,
      activeAlerts: activeAlertsCount,
      totalSmsDispatched: smsLogs.length,
      totalIvrHandled: ivrLogs.length
    },
    helpline: getHelplineConfig().number
  });
};

const getPendingVerifications = (req, res) => {
  const reports = db.find('disease_reports', { officerVerificationStatus: 'PENDING_VERIFICATION' });
  const enriched = reports.map((r) => {
    const farmer = db.findById('farmers', r.farmerId);
    const village = db.findById('villages', r.villageId);
    return {
      ...r,
      farmerName: farmer ? farmer.name : 'Farmer',
      farmerPhone: farmer ? farmer.phone : null,
      villageName: village ? village.name : 'Village'
    };
  });

  return res.json({
    success: true,
    count: enriched.length,
    pending: enriched
  });
};

const getAlerts = (req, res) => {
  const alerts = db.get('alerts');
  const enriched = alerts.map((a) => {
    const village = db.findById('villages', a.villageId);
    return {
      ...a,
      villageName: village ? village.name : 'Unknown Village',
      villageNameHi: village ? village.nameHi : '',
      villageNameMr: village ? village.nameMr : ''
    };
  });

  return res.json({
    success: true,
    count: enriched.length,
    alerts: enriched,
    helpline: getHelplineConfig().number
  });
};

const createManualAlert = (req, res) => {
  const { villageId, crop, diseaseOrPest, riskScore = 80, customAdvisory, shouldBroadcastSms = true } = req.body;
  const village = db.findById('villages', villageId);

  if (!village) {
    return res.status(404).json({ success: false, message: 'Village not found.' });
  }

  const alert = db.create('alerts', {
    villageId,
    crop: crop || 'Cotton',
    diseaseOrPest: diseaseOrPest || 'General Pest Outbreak',
    riskLevel: riskScore > 70 ? 'HIGH' : riskScore >= 40 ? 'MEDIUM' : 'LOW',
    riskScore: parseInt(riskScore),
    triggerReason: customAdvisory || 'Agriculture Officer Emergency Directive',
    sentToFarmerCount: village.farmerCount || 450,
    channelsDispatched: ['OFFICER_DASHBOARD', 'SMS', 'VOICE_IVR'],
    broadcastDate: new Date().toISOString(),
    helplineIncluded: getHelplineConfig().number,
    status: 'ACTIVE'
  });

  let broadcastResult = null;
  if (shouldBroadcastSms) {
    broadcastResult = broadcastVillageAlert({
      villageId,
      crop: alert.crop,
      disease: alert.diseaseOrPest,
      riskScore: alert.riskScore,
      customMessage: customAdvisory
    });
  }

  return res.status(201).json({
    success: true,
    message: `Official alert published for ${village.name}.`,
    alert,
    broadcastResult
  });
};

module.exports = {
  getOfficerDashboardStats,
  getPendingVerifications,
  getAlerts,
  createManualAlert
};
