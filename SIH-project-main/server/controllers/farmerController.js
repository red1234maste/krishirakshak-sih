const db = require('../config/db');
const { getHelplineConfig } = require('../config/helpline');

const getAllFarmers = (req, res) => {
  const { villageId } = req.query;
  let farmers = db.get('farmers');

  if (villageId) {
    farmers = farmers.filter((f) => f.villageId === villageId);
  }

  const enriched = farmers.map((f) => {
    const village = db.findById('villages', f.villageId);
    const farms = db.find('farms', { farmerId: f.id });
    const reports = db.find('disease_reports', { farmerId: f.id });
    return {
      ...f,
      villageName: village ? village.name : 'Unknown',
      villageRisk: village ? village.riskLevel : 'LOW',
      farmsCount: farms.length,
      reportsCount: reports.length
    };
  });

  return res.json({
    success: true,
    count: enriched.length,
    farmers: enriched,
    helpline: getHelplineConfig().number
  });
};

const registerOfflineFarmer = (req, res) => {
  const {
    name,
    nameHi,
    nameMr,
    phone,
    villageId = 'vil-01',
    preferredLanguage = 'hi',
    aadhaarLast4 = '0000',
    soilType = 'Black Cotton Soil',
    primaryCrop = 'Cotton',
    landSizeAcres = 3.0,
    surveyNumber = 'Gat No. 101',
    channelPreference = 'IVR_AND_SMS'
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Farmer name and phone number are required.' });
  }

  const registeredBy = req.user ? req.user.id : 'usr-mitra-01';

  // Create or link user
  let user = db.findOne('users', { phone });
  if (!user) {
    user = db.create('users', {
      name,
      phone,
      role: 'farmer',
      preferredLanguage,
      villageId
    });
  }

  // Create Farmer entity
  const newFarmer = db.create('farmers', {
    userId: user.id,
    name,
    nameHi: nameHi || name,
    nameMr: nameMr || name,
    phone,
    villageId,
    preferredLanguage,
    hasSmartphone: false,
    aadhaarLast4,
    soilType,
    primaryCrop,
    landSizeAcres: parseFloat(landSizeAcres),
    channelPreference,
    registeredBy
  });

  // Create corresponding farm entry
  const newFarm = db.create('farms', {
    farmerId: newFarmer.id,
    villageId,
    surveyNumber,
    crop: primaryCrop,
    variety: 'Standard Regional Variety',
    sowingDate: '2026-06-15',
    cropStage: 'Vegetative / Flowering',
    areaAcres: parseFloat(landSizeAcres),
    latitude: 20.1700,
    longitude: 73.9800,
    irrigationType: 'Rainfed',
    currentRiskLevel: 'MEDIUM',
    currentRiskScore: 50
  });

  return res.status(201).json({
    success: true,
    message: 'Offline farmer registered successfully into KrishiRakshak network.',
    farmer: newFarmer,
    farm: newFarm,
    helpline: getHelplineConfig().number
  });
};

const getFieldVisits = (req, res) => {
  const visits = db.get('field_visits');
  const enriched = visits.map((v) => {
    const farmer = db.findById('farmers', v.farmerId);
    const village = db.findById('villages', v.villageId);
    return {
      ...v,
      farmerName: farmer ? farmer.name : 'Unknown Farmer',
      villageName: village ? village.name : 'Unknown Village'
    };
  });

  return res.json({
    success: true,
    count: enriched.length,
    visits: enriched
  });
};

const createFieldVisit = (req, res) => {
  const { farmerId, villageId, observations, soilMoisture, pestCountPerPlant, followUpNeeded } = req.body;
  const agriMitraId = req.user ? req.user.id : 'usr-mitra-01';

  const visit = db.create('field_visits', {
    agriMitraId,
    farmerId,
    villageId,
    visitDate: new Date().toISOString().split('T')[0],
    observations,
    soilMoisture: soilMoisture || 'Adequate',
    pestCountPerPlant: pestCountPerPlant ? parseFloat(pestCountPerPlant) : 0,
    followUpNeeded: Boolean(followUpNeeded)
  });

  return res.status(201).json({
    success: true,
    message: 'Field visit observation recorded.',
    visit
  });
};

module.exports = {
  getAllFarmers,
  registerOfflineFarmer,
  getFieldVisits,
  createFieldVisit
};
