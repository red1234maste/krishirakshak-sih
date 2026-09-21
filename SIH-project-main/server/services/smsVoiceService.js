const db = require('../config/db');
const { getHelplineConfig } = require('../config/helpline');

/**
 * Multilingual SMS & Voice Alert Service (Hindi, Marathi, English)
 * Pluggable adapter pattern (Mock Simulator + ready for Twilio/Gupshup/Exotel)
 */

const TEMPLATES = {
  HIGH_RISK_OUTBREAK: {
    en: (data) =>
      `[EN] KRISHIRAKSHAK ALERT: High ${data.crop} pest/disease risk (${data.riskScore}%) detected in ${data.village}. Threat: ${data.disease}. Inspect your farm immediately or meet Village Agri Mitra. Kisan Suraksha Helpline (Toll-Free): ${data.helpline}`,
    hi: (data) =>
      `[HI] कृषि-रक्षक चेतावनी: ${data.village} क्षेत्र में ${data.crop} में ${data.disease} का उच्च जोखिम (${data.riskScore}%) पाया गया है। कृपया अपने खेत की जांच करें या नजदीकी कृषि मित्र से संपर्क करें। निःशुल्क किसान सुरक्षा हेल्पलाइन: ${data.helpline}`,
    mr: (data) =>
      `[MR] कृषी-रक्षक इशारा: ${data.village} परिसरात ${data.crop} पिकावर ${data.disease} रोगाचा उच्च धोका (${data.riskScore}%) आढळला आहे. तात्काळ पिकाची पाहणी करा किंवा कृषी मित्राशी संपर्क साधा. मोफत किसान सुरक्षा हेल्पलाइन: ${data.helpline}`
  },

  OFFICER_PRESCRIPTION: {
    en: (data) =>
      `[EN] Crop Advisory from Agriculture Officer: For ${data.crop} (${data.disease}), prescribed action: ${data.prescription}. Toll-Free Kisan Helpline: ${data.helpline}`,
    hi: (data) =>
      `[HI] कृषि अधिकारी परामर्श: ${data.crop} में ${data.disease} के लिए अनुमोदित उपचार: ${data.prescription}। सहायता: ${data.helpline}`,
    mr: (data) =>
      `[MR] कृषी अधिकारी सल्ला: ${data.crop} वरील ${data.disease} साठी शिफारस: ${data.prescription}. मोफत हेल्पलाइन: ${data.helpline}`
  },

  WEATHER_ADVISORY: {
    en: (data) =>
      `[EN] Weather Alert: High humidity (${data.humidity}%) & continuous leaf moisture in ${data.village}. Favorable for fungal spore outbreak in ${data.crop}. Toll-Free Kisan Helpline: ${data.helpline}`,
    hi: (data) =>
      `[HI] मौसम चेतावनी: ${data.village} में उच्च आर्द्रता (${data.humidity}%) के कारण ${data.crop} में फफूंद रोग की संभावना। सावधानी बरतें। हेल्पलाइन: ${data.helpline}`,
    mr: (data) =>
      `[MR] हवामान इशारा: ${data.village} मध्ये जास्त दमट हवेमुळे (${data.humidity}%) ${data.crop} पिकावर बुरशीजन्य रोगाचा प्रादुर्भाव संभवतो. हेल्पलाइन: ${data.helpline}`
  }
};

const sendSms = ({
  recipientPhone,
  recipientName = 'Farmer',
  language = 'hi',
  templateKey = 'HIGH_RISK_OUTBREAK',
  templateData = {}
}) => {
  const helpline = getHelplineConfig().number;
  const langKey = ['hi', 'mr', 'en'].includes(language) ? language : 'hi';

  const templateGroup = TEMPLATES[templateKey] || TEMPLATES.HIGH_RISK_OUTBREAK;
  const renderer = templateGroup[langKey] || templateGroup.hi;

  const messageContent = renderer({
    ...templateData,
    helpline
  });

  const smsRecord = db.create('sms_logs', {
    recipientPhone,
    recipientName,
    language: langKey,
    templateKey,
    messageContent,
    deliveryStatus: 'DELIVERED',
    provider: 'KRISHI_SMS_ADAPTER_MOCK',
    timestamp: new Date().toISOString()
  });

  return {
    success: true,
    smsRecord
  };
};

const broadcastVillageAlert = ({
  villageId,
  crop = 'Cotton',
  disease = 'Pink Bollworm & Fungal Blight',
  riskScore = 80,
  customMessage = null
}) => {
  const village = db.findById('villages', villageId);
  const farmers = db.find('farmers', { villageId });
  const helpline = getHelplineConfig().number;

  const results = [];
  farmers.forEach((farmer) => {
    const lang = farmer.preferredLanguage || 'mr';
    let messageContent = '';

    if (customMessage) {
      messageContent = `[${lang.toUpperCase()}] ${customMessage} | Kisan Helpline: ${helpline}`;
    } else {
      const templateGroup = TEMPLATES.HIGH_RISK_OUTBREAK;
      const renderer = templateGroup[lang] || templateGroup.hi;
      messageContent = renderer({
        crop,
        village: lang === 'mr' ? (village.nameMr || village.name) : lang === 'hi' ? (village.nameHi || village.name) : village.name,
        disease,
        riskScore,
        helpline
      });
    }

    const log = db.create('sms_logs', {
      recipientPhone: farmer.phone,
      recipientName: farmer.name,
      language: lang,
      messageContent,
      deliveryStatus: 'DELIVERED',
      alertType: 'HIGH_RISK_BROADCAST',
      timestamp: new Date().toISOString()
    });

    results.push(log);
  });

  return {
    village: village ? village.name : villageId,
    totalDispatched: results.length,
    logs: results
  };
};

module.exports = {
  sendSms,
  broadcastVillageAlert,
  TEMPLATES
};
