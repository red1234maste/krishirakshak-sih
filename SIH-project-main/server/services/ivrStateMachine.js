const db = require('../config/db');
const { getHelplineConfig } = require('../config/helpline');

/**
 * Interactive Voice Response (IVR) State Machine Engine
 * Supports trilingual voice workflows (Hindi, Marathi, English)
 */

const IVR_FLOW = {
  START: {
    prompt: {
      en: "Welcome to Kisan Suraksha Early Warning Helpline. Press 1 for Hindi, Press 2 for Marathi, Press 3 for English.",
      hi: "किसान सुरक्षा फसल रोग पूर्व चेतावनी हेल्पलाइन में आपका स्वागत है। हिन्दी के लिए 1 दबाएं, मराठी के लिए 2 दबाएं, अंग्रेजी के लिए 3 दबाएं।",
      mr: "किसान सुरक्षा पीक रोग पूर्वसूचना हेल्पलाइन मध्ये आपले स्वागत आहे. हिंदीसाठी 1 दाबा, मराठीसाठी 2 दाबा, इंग्रजीसाठी 3 दाबा."
    },
    next: "SELECT_LANGUAGE"
  },

  SELECT_LANGUAGE: {
    options: {
      "1": { lang: "hi", label: "हिन्दी" },
      "2": { lang: "mr", label: "मराठी" },
      "3": { lang: "en", label: "English" }
    },
    next: "SELECT_CROP"
  },

  SELECT_CROP: {
    prompt: {
      en: "Please select your crop. Press 1 for Cotton, Press 2 for Soybean, Press 3 for Wheat, Press 4 for Tomato, Press 5 for Other crops.",
      hi: "कृपया अपनी फसल चुनें। कपास के लिए 1 दबाएं, सोयाबीन के लिए 2 दबाएं, गेहूं के लिए 3 दबाएं, टमाटर के लिए 4 दबाएं, अन्य फसल के लिए 5 दबाएं।",
      mr: "कृपया आपले पीक निवडा. कापूस पिकासाठी 1 दाबा, सोयाबीनसाठी 2 दाबा, गव्हासाठी 3 दाबा, टोमॅटोसाठी 4 दाबा, इतर पिकांसाठी 5 दाबा."
    },
    options: {
      "1": { crop: "Cotton", nameHi: "कपास", nameMr: "कापूस" },
      "2": { crop: "Soybean", nameHi: "सोयाबीन", nameMr: "सोयाबीन" },
      "3": { crop: "Wheat", nameHi: "गेहूं", nameMr: "गहू" },
      "4": { crop: "Tomato", nameHi: "टमाटर", nameMr: "टोमॅटो" },
      "5": { crop: "Other", nameHi: "अन्य फसल", nameMr: "इतर पिके" }
    },
    next: "SELECT_SYMPTOM"
  },

  SELECT_SYMPTOM: {
    prompt: {
      en: "Select the symptom observed. Press 1 for leaf spots or yellowing, Press 2 for worms or insect holes, Press 3 for wilting or plant drying, Press 4 for flower or fruit drop.",
      hi: "लक्षण चुनें। पत्तियों पर काले-पीले धब्बों के लिए 1 दबाएं, सुंडी या कीड़े के छेद के लिए 2 दबाएं, पौधों के सूखने/मुरझाने के लिए 3 दबाएं, फूल या फल गिरने के लिए 4 दबाएं।",
      mr: "पानावरील लक्षण निवडा. पानांवर डाग किंवा पिवळेपणासाठी 1 दाबा, बोंडअळी किंवा किडींच्या छिद्रांसाठी 2 दाबा, झाड सुकणे/कोमजण्यासाठी 3 दाबा, फुले किंवा फळे गळण्यासाठी 4 दाबा."
    },
    options: {
      "1": { code: "LEAF_SPOTS", nameEn: "Leaf spots / Blight / Rust", nameHi: "पत्तियों पर धब्बे / झुलसा", nameMr: "पानावरील डाग / करपा" },
      "2": { code: "PEST_BORER", nameEn: "Pink Bollworm / Caterpillar / Borer", nameHi: "गुलाबी सुंडी / कीट प्रकोप", nameMr: "बोंडअळी / किडींचा प्रादुर्भाव" },
      "3": { code: "WILTING", nameEn: "Wilting / Root Rot", nameHi: "मुरझाना / जड़ सड़न", nameMr: "झाड कोमजणे / मूळ कुज" },
      "4": { code: "FLOWER_DROP", nameEn: "Flower / Fruit Dropping", nameHi: "फूल या फल गिरना", nameMr: "फुले किंवा फळे गळणे" }
    },
    next: "DELIVER_ADVISORY"
  }
};

const ADVISORIES = {
  Cotton: {
    PEST_BORER: {
      en: "Cotton Pink Bollworm Alert: High vulnerability detected. Install 5 pheromone traps per acre. If trap catch exceeds 8 moths per night, spray Profenofos 50% EC @ 30ml/10L water. Kisan Helpline: 1800-180-1551.",
      hi: "कपास गुलाबी सुंडी परामर्श: अपने खेत में 5 फेरोमोन ट्रैप प्रति एकड़ लगाएं। यदि ट्रैप में 8 से अधिक पतंगे आएं, तो प्रोफेनोफॉस 50% ईसी (30 मिली/10 ली पानी) का छिड़काव करें। सहायता: 1800-180-1551।",
      mr: "कापूस गुलाबी बोंडअळी सल्ला: एकरी ५ फेरोमोन ट्रॅप लावा. ट्रॅपमध्ये ८ पेक्षा जास्त पतंग आढळल्यास प्रोफेनोफॉस ५०% ईसी (३० मिली/१० लिटर पाणी) फवारा. हेल्पलाइन: 1800-180-1551."
    },
    LEAF_SPOTS: {
      en: "Cotton Bacterial Blight / Grey Mildew: Spray Copper Oxychloride (25g) + Streptocycline (1g) in 10L water. Ensure proper drainage. Kisan Helpline: 1800-180-1551.",
      hi: "कपास बैक्टीरियल ब्लाइट: कॉपर ऑक्सीक्लोराइड 25 ग्राम + स्ट्रेप्टोसाइक्लिन 1 ग्राम 10 लीटर पानी में घोलकर छिड़कें। हेल्पलाइन: 1800-180-1551।",
      mr: "कापूस करपा रोग: कॉपर ऑक्सिक्लोराईड २५ ग्रॅम + स्ट्रेप्टोसायक्लिन १ ग्रॅम १० लिटर पाण्यात मिसळून फवारावे. मदत: 1800-180-1551."
    }
  },
  Soybean: {
    LEAF_SPOTS: {
      en: "Soybean Rust & Cercospora: Spray Hexaconazole 5% EC @ 20ml/10L water or Mancozeb 75% WP @ 25g/10L. Kisan Helpline: 1800-180-1551.",
      hi: "सोयाबीन गेरुआ व धब्बा रोग: हेक्साकोनाज़ोल 5% ईसी 20 मिली अथवा मैंकोज़ेब 25 ग्राम प्रति 10 लीटर पानी में छिड़कें। हेल्पलाइन: 1800-180-1551।",
      mr: "सोयाबीन तांबेरा व करपा: हेक्साकोनाझोल ५% ईसी २० मिली किंवा मॅन्कोझेब २५ ग्रॅम १० लिटर पाण्यात फवारा. हेल्पलाइन: 1800-180-1551."
    },
    PEST_BORER: {
      en: "Soybean Girdle Beetle / Semilooper: Spray Chlorantraniliprole 18.5% SC @ 3ml per 10L water. Toll-Free Kisan Helpline: 1800-180-1551.",
      hi: "सोयाबीन गर्डल बीटल / कीट: क्लोरेंट्रानिलिप्रोल 18.5% एससी (3 मिली/10 लीटर पानी) का छिड़काव करें। हेल्पलाइन: 1800-180-1551।",
      mr: "सोयाबीन खोडकिडा / अळी: क्लोरँट्रानिलीप्रोल १८.५% एससी ३ मिली प्रति १० लिटर पाण्यात फवारा. हेल्पलाइन: 1800-180-1551."
    }
  },
  Tomato: {
    LEAF_SPOTS: {
      en: "Tomato Early Blight: Spray Azoxystrobin 23% SC @ 1ml/L or Chlorothalonil 75% WP @ 2g/L. Kisan Helpline: 1800-180-1551.",
      hi: "टमाटर अगेती झुलसा: एज़ोक्सीस्ट्रोबिन 1 मिली/लीटर अथवा क्लोरोथैलोनिल 2 ग्राम/लीटर का छिड़काव करें। हेल्पलाइन: 1800-180-1551।",
      mr: "टोमॅटो करपा: अॅझॉक्सीस्ट्रॉबिन १ मिली/लिटर किंवा क्लोरोथॅलोनिल २ ग्रॅम/लिटर पाण्यात फवारा. हेल्पलाइन: 1800-180-1551."
    }
  },
  Default: {
    en: "General Advisory: High moisture favors fungal pathogens. Ensure soil aeration and inspect leaf undersides. To speak with a senior agricultural scientist, call our Toll-Free Kisan Suraksha Helpline at 1800-180-1551.",
    hi: "सामान्य सलाह: उच्च नमी से कीट व फफूंद का खतरा बढ़ता है। खेत की नियमित जांच करें। कृषि विशेषज्ञ से सीधी बात करने हेतु टोल-फ्री किसान सुरक्षा हेल्पलाइन 1800-180-1551 पर कॉल करें।",
    mr: "सर्वसाधारण सल्ला: जास्त दमट हवेमुळे किडींचा प्रादुर्भाव वाढू शकतो. पिकाची नियमित पाहणी करा. कृषी तज्ज्ञांशी थेट बोलण्यासाठी मोफत किसान सुरक्षा हेल्पलाइन 1800-180-1551 वर कॉल करा."
  }
};

const processIvrStep = ({
  currentState = 'START',
  inputKey = null,
  sessionData = { language: 'hi', crop: null, symptom: null, callerPhone: '9822012345' }
}) => {
  const helpline = getHelplineConfig().number;
  let nextState = currentState;
  let responsePrompt = '';
  let updatedSession = { ...sessionData };
  let isComplete = false;
  let advisoryText = null;

  switch (currentState) {
    case 'START':
      responsePrompt = IVR_FLOW.START.prompt.hi;
      nextState = 'SELECT_LANGUAGE';
      break;

    case 'SELECT_LANGUAGE':
      if (inputKey === '1') updatedSession.language = 'hi';
      else if (inputKey === '2') updatedSession.language = 'mr';
      else if (inputKey === '3') updatedSession.language = 'en';
      else updatedSession.language = 'hi';

      const lang = updatedSession.language;
      responsePrompt = IVR_FLOW.SELECT_CROP.prompt[lang];
      nextState = 'SELECT_CROP';
      break;

    case 'SELECT_CROP':
      const cropOption = IVR_FLOW.SELECT_CROP.options[inputKey] || IVR_FLOW.SELECT_CROP.options['1'];
      updatedSession.crop = cropOption.crop;
      const curLang = updatedSession.language || 'hi';
      responsePrompt = IVR_FLOW.SELECT_SYMPTOM.prompt[curLang];
      nextState = 'SELECT_SYMPTOM';
      break;

    case 'SELECT_SYMPTOM':
      const symptomOption = IVR_FLOW.SELECT_SYMPTOM.options[inputKey] || IVR_FLOW.SELECT_SYMPTOM.options['1'];
      updatedSession.symptom = symptomOption.code;
      const langChoice = updatedSession.language || 'hi';
      const cropChoice = updatedSession.crop || 'Cotton';

      // Look up advisory
      const cropAdvisories = ADVISORIES[cropChoice] || ADVISORIES.Cotton;
      const symptomAdv = cropAdvisories[symptomOption.code] || ADVISORIES.Default;
      advisoryText = symptomAdv[langChoice] || symptomAdv.en || ADVISORIES.Default[langChoice];

      responsePrompt = `${advisoryText} | Kisan Suraksha Helpline: ${helpline}`;
      nextState = 'COMPLETED';
      isComplete = true;

      // Log the completed IVR interaction
      db.create('ivr_calls', {
        callerPhone: updatedSession.callerPhone || '9822012345',
        farmerName: updatedSession.farmerName || 'Caller',
        village: updatedSession.village || 'Pimpalgaon Baswant',
        callType: updatedSession.callType || 'INCOMING_DIAL_IN',
        languageSelected: updatedSession.language,
        selectedCrop: updatedSession.crop,
        selectedProblem: symptomOption.nameEn,
        durationSeconds: 125,
        advisoryDelivered: responsePrompt,
        status: 'COMPLETED',
        timestamp: new Date().toISOString()
      });
      break;

    default:
      responsePrompt = IVR_FLOW.START.prompt.hi;
      nextState = 'SELECT_LANGUAGE';
      break;
  }

  return {
    currentState,
    nextState,
    responsePrompt,
    sessionData: updatedSession,
    isComplete,
    advisoryText,
    helpline
  };
};

const handleMissedCall = (callerPhone = '9822012345') => {
  const helpline = getHelplineConfig().number;
  const farmer = db.findOne('farmers', { phone: callerPhone }) || {
    name: 'Farmer Friend',
    preferredLanguage: 'hi',
    villageId: 'vil-01'
  };

  const missedCallLog = db.create('ivr_calls', {
    callerPhone,
    farmerName: farmer.name,
    village: 'Pimpalgaon Baswant',
    callType: 'MISSED_CALL_CALLBACK',
    languageSelected: farmer.preferredLanguage || 'hi',
    durationSeconds: 0,
    status: 'CALLBACK_QUEUED',
    timestamp: new Date().toISOString()
  });

  return {
    success: true,
    message: `Missed call registered from ${callerPhone}. Automatic IVR callback triggered within 15 seconds.`,
    callId: missedCallLog.id,
    callerPhone,
    helpline
  };
};

module.exports = {
  IVR_FLOW,
  ADVISORIES,
  processIvrStep,
  handleMissedCall
};
