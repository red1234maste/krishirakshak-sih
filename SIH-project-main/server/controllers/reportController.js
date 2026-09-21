const db = require('../config/db');
const { diagnoseCropImage } = require('../services/aiServiceAdapter');
const { broadcastVillageAlert } = require('../services/smsVoiceService');
const { getHelplineConfig } = require('../config/helpline');

const getAllReports = (req, res) => {
  const { villageId, status, crop, officerVerificationStatus } = req.query;
  let reports = db.get('disease_reports');

  if (villageId) {
    reports = reports.filter((r) => r.villageId === villageId);
  }
  if (status) {
    reports = reports.filter((r) => r.status === status);
  }
  if (crop) {
    reports = reports.filter((r) => r.crop.toLowerCase() === crop.toLowerCase());
  }
  if (officerVerificationStatus) {
    reports = reports.filter((r) => r.officerVerificationStatus === officerVerificationStatus);
  }

  // Enrich with farmer & village info
  const enriched = reports.map((r) => {
    const farmer = db.findById('farmers', r.farmerId);
    const village = db.findById('villages', r.villageId);
    return {
      ...r,
      farmerName: farmer ? farmer.name : 'Unknown Farmer',
      farmerPhone: farmer ? farmer.phone : null,
      villageName: village ? village.name : 'Unknown Village',
      helpline: getHelplineConfig().number
    };
  });

  return res.json({ success: true, count: enriched.length, reports: enriched });
};

const getReportById = (req, res) => {
  const report = db.findById('disease_reports', req.params.id);
  if (!report) {
    return res.status(404).json({ success: false, message: 'Disease report not found.' });
  }

  const farmer = db.findById('farmers', report.farmerId);
  const village = db.findById('villages', report.villageId);
  const farm = db.findById('farms', report.farmId);
  const officer = report.verifiedByOfficerId ? db.findById('users', report.verifiedByOfficerId) : null;

  return res.json({
    success: true,
    report: {
      ...report,
      farmer,
      village,
      farm,
      officer,
      helpline: getHelplineConfig().number
    }
  });
};

const runAiDiagnosis = async (req, res) => {
  try {
    const { crop = 'Cotton', location = 'Pimpalgaon' } = req.body;
    const file = req.file;

    const result = await diagnoseCropImage({
      imageBuffer: file ? file.buffer : null,
      fileName: file ? file.originalname : 'sample_leaf.jpg',
      cropHint: crop,
      location
    });

    return res.json({
      success: true,
      result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'AI diagnosis pipeline encountered an issue.',
      error: error.message
    });
  }
};

const createReport = async (req, res) => {
  try {
    const {
      farmerId,
      farmId,
      villageId = 'vil-01',
      crop = 'Cotton',
      symptomsObserved,
      symptomsHi,
      symptomsMr,
      reportedVia = 'WEB_PORTAL',
      precomputedAiResult
    } = req.body;

    const reporterId = req.user ? req.user.id : 'usr-mitra-01';
    const reporterRole = req.user ? req.user.role : 'agri_mitra';

    // If farmerId is not provided, locate by user or default
    let finalFarmerId = farmerId;
    if (!finalFarmerId && req.user && req.user.role === 'farmer') {
      const f = db.findOne('farmers', { userId: req.user.id });
      if (f) finalFarmerId = f.id;
    }
    if (!finalFarmerId) {
      finalFarmerId = 'frm-01';
    }

    // Run or use AI prediction
    let aiDiagnosis = precomputedAiResult;
    if (!aiDiagnosis) {
      aiDiagnosis = await diagnoseCropImage({
        cropHint: crop,
        location: villageId
      });
    }

    const newReport = db.create('disease_reports', {
      farmerId: finalFarmerId,
      farmId: farmId || 'farm-01',
      villageId,
      crop,
      symptomsObserved: symptomsObserved || 'Leaf spots and visible foliar discoloration',
      symptomsHi: symptomsHi || 'पत्तियों पर धब्बे और पीलापन',
      symptomsMr: symptomsMr || 'पानांवर डाग आणि पिवळेपणा',
      reportedVia,
      reporterId,
      reporterRole,
      imageSample: req.file ? req.file.originalname : 'leaf_scan.jpg',
      aiPredictedDisease: aiDiagnosis.disease,
      aiConfidence: aiDiagnosis.confidence || 0.90,
      aiRiskLevel: aiDiagnosis.risk || 'HIGH',
      aiRecommendation: aiDiagnosis.recommendation,
      officerVerificationStatus: 'PENDING_VERIFICATION',
      verifiedByOfficerId: null,
      verifiedAt: null,
      officerPrescription: null,
      status: 'UNDER_OFFICER_REVIEW'
    });

    return res.status(201).json({
      success: true,
      message: 'Disease report registered. Queued for Agriculture Officer verification.',
      report: newReport
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyReport = (req, res) => {
  const { id } = req.params;
  const {
    officerPrescription,
    officerPrescriptionHi,
    officerPrescriptionMr,
    status = 'VERIFIED',
    confirmedDisease,
    shouldBroadcastAlert = false
  } = req.body;

  const report = db.findById('disease_reports', id);
  if (!report) {
    return res.status(404).json({ success: false, message: 'Report not found.' });
  }

  const officerId = req.user ? req.user.id : 'usr-officer-01';

  const updatedReport = db.update('disease_reports', id, {
    officerVerificationStatus: status,
    verifiedByOfficerId: officerId,
    verifiedAt: new Date().toISOString(),
    officerPrescription: officerPrescription || 'Approved expert advisory. Follow dosage instructions.',
    officerPrescriptionHi: officerPrescriptionHi || 'अनुमोदित विशेषज्ञ परामर्श। खुराक निर्देशों का पालन करें।',
    officerPrescriptionMr: officerPrescriptionMr || 'मान्य कृषी तज्ज्ञ सल्ला. औषध प्रमाण तपासा.',
    aiPredictedDisease: confirmedDisease || report.aiPredictedDisease,
    status: status === 'VERIFIED' ? 'RESOLVED_WITH_ADVISORY' : 'REJECTED_OR_CLOSED'
  });

  let broadcastResult = null;
  if (shouldBroadcastAlert && status === 'VERIFIED') {
    broadcastResult = broadcastVillageAlert({
      villageId: report.villageId,
      crop: report.crop,
      disease: confirmedDisease || report.aiPredictedDisease,
      riskScore: 85
    });
  }

  return res.json({
    success: true,
    message: 'Report verified by Agriculture Officer successfully.',
    report: updatedReport,
    broadcastResult
  });
};

module.exports = {
  getAllReports,
  getReportById,
  runAiDiagnosis,
  createReport,
  verifyReport
};
