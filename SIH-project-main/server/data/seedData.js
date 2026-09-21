const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const defaultPasswordHash = bcrypt.hashSync('password123', salt);

const initialSeedData = {
  users: [
    {
      id: "usr-farmer-01",
      name: "Ramesh Tukaram Patil",
      phone: "9822012345",
      role: "farmer",
      preferredLanguage: "mr",
      password: defaultPasswordHash,
      villageId: "vil-01",
      createdAt: "2026-08-01T10:00:00Z"
    },
    {
      id: "usr-farmer-02",
      name: "Suresh Chandra Sharma",
      phone: "9876543210",
      role: "farmer",
      preferredLanguage: "hi",
      password: defaultPasswordHash,
      villageId: "vil-02",
      createdAt: "2026-08-02T11:30:00Z"
    },
    {
      id: "usr-farmer-03",
      name: "Anand Rao Deshmukh",
      phone: "9421098765",
      role: "farmer",
      preferredLanguage: "mr",
      password: defaultPasswordHash,
      villageId: "vil-03",
      createdAt: "2026-08-03T09:15:00Z"
    },
    {
      id: "usr-farmer-04",
      name: "Vikram Singh Patel",
      phone: "9123456780",
      role: "farmer",
      preferredLanguage: "en",
      password: defaultPasswordHash,
      villageId: "vil-01",
      createdAt: "2026-08-04T14:20:00Z"
    },
    {
      id: "usr-mitra-01",
      name: "Kavita Dnyaneshwar Shinde (Agri Mitra / CSC)",
      phone: "9988776655",
      role: "agri_mitra",
      preferredLanguage: "mr",
      password: defaultPasswordHash,
      cscCenter: "CSC Center Rahata #104",
      assignedVillages: ["vil-01", "vil-02", "vil-03"],
      createdAt: "2026-07-15T08:00:00Z"
    },
    {
      id: "usr-officer-01",
      name: "Dr. Rajeshwar K. Verma (District Agriculture Officer)",
      phone: "9811223344",
      role: "agri_officer",
      preferredLanguage: "en",
      password: defaultPasswordHash,
      department: "Sub-Divisional Agriculture Office, Nashik-Ahmednagar",
      badgeNumber: "MH-AGRI-2024-889",
      jurisdiction: ["vil-01", "vil-02", "vil-03", "vil-04", "vil-05"],
      createdAt: "2026-07-01T09:00:00Z"
    },
    {
      id: "usr-admin-01",
      name: "KrishiRakshak System Administrator",
      phone: "9000000001",
      role: "admin",
      preferredLanguage: "en",
      password: defaultPasswordHash,
      createdAt: "2026-06-01T00:00:00Z"
    }
  ],

  villages: [
    {
      id: "vil-01",
      name: "Pimpalgaon Baswant",
      nameHi: "पिंपलगांव बसवंत",
      nameMr: "पिंपळगाव बसवंत",
      district: "Nashik",
      state: "Maharashtra",
      latitude: 20.1706,
      longitude: 73.9878,
      population: 18500,
      farmerCount: 1420,
      totalFarms: 980,
      primaryCrops: ["Cotton", "Soybean", "Tomato", "Grapes"],
      riskLevel: "HIGH",
      riskScore: 78,
      weatherAlert: "High humidity (>85%) & continuous dew conducive to fungal blight and pink bollworm",
      geoJsonPolygon: {
        type: "Polygon",
        coordinates: [
          [
            [73.9750, 20.1600],
            [74.0000, 20.1600],
            [74.0050, 20.1800],
            [73.9800, 20.1850],
            [73.9750, 20.1600]
          ]
        ]
      }
    },
    {
      id: "vil-02",
      name: "Rahata Rural",
      nameHi: "राहाता ग्रामीण",
      nameMr: "राहाता ग्रामीण",
      district: "Ahmednagar",
      state: "Maharashtra",
      latitude: 19.8700,
      longitude: 74.4800,
      population: 14200,
      farmerCount: 1100,
      totalFarms: 750,
      primaryCrops: ["Cotton", "Soybean", "Wheat", "Sugarcane"],
      riskLevel: "MEDIUM",
      riskScore: 54,
      weatherAlert: "Intermittent light drizzle with temperature at 28°C",
      geoJsonPolygon: {
        type: "Polygon",
        coordinates: [
          [
            [74.4650, 19.8600],
            [74.4950, 19.8600],
            [74.5000, 19.8800],
            [74.4700, 19.8850],
            [74.4650, 19.8600]
          ]
        ]
      }
    },
    {
      id: "vil-03",
      name: "Kopargaon North",
      nameHi: "कोपरगांव उत्तर",
      nameMr: "कोपरगाव उत्तर",
      district: "Ahmednagar",
      state: "Maharashtra",
      latitude: 19.8900,
      longitude: 74.4750,
      population: 22000,
      farmerCount: 1680,
      totalFarms: 1150,
      primaryCrops: ["Soybean", "Cotton", "Wheat"],
      riskLevel: "HIGH",
      riskScore: 82,
      weatherAlert: "Pest outbreak confirmed in adjoining sector; Pink bollworm trap catch > 8 moths/trap",
      geoJsonPolygon: {
        type: "Polygon",
        coordinates: [
          [
            [74.4600, 19.8800],
            [74.4900, 19.8800],
            [74.4950, 19.9050],
            [74.4650, 19.9000],
            [74.4600, 19.8800]
          ]
        ]
      }
    },
    {
      id: "vil-04",
      name: "Sangamner South",
      nameHi: "संगमनेर दक्षिण",
      nameMr: "संगमनेर दक्षिण",
      district: "Ahmednagar",
      state: "Maharashtra",
      latitude: 19.5700,
      longitude: 74.2100,
      population: 16300,
      farmerCount: 1250,
      totalFarms: 820,
      primaryCrops: ["Tomato", "Pomegranate", "Wheat", "Soybean"],
      riskLevel: "LOW",
      riskScore: 26,
      weatherAlert: "Clear sunny conditions, low pest favorability index",
      geoJsonPolygon: {
        type: "Polygon",
        coordinates: [
          [
            [74.1950, 19.5600],
            [74.2250, 19.5600],
            [74.2300, 19.5800],
            [74.2000, 19.5850],
            [74.1950, 19.5600]
          ]
        ]
      }
    },
    {
      id: "vil-05",
      name: "Niphad Valley",
      nameHi: "निफाड घाटी",
      nameMr: "निफाड खोरे",
      district: "Nashik",
      state: "Maharashtra",
      latitude: 20.0800,
      longitude: 74.1100,
      population: 19400,
      farmerCount: 1530,
      totalFarms: 1040,
      primaryCrops: ["Wheat", "Soybean", "Grapes", "Sugarcane"],
      riskLevel: "MEDIUM",
      riskScore: 61,
      weatherAlert: "Morning fog observed with overnight leaf wetness index 7.5 hrs",
      geoJsonPolygon: {
        type: "Polygon",
        coordinates: [
          [
            [74.0950, 20.0700],
            [74.1250, 20.0700],
            [74.1300, 20.0900],
            [74.1000, 20.0950],
            [74.0950, 20.0700]
          ]
        ]
      }
    }
  ],

  farmers: [
    {
      id: "frm-01",
      userId: "usr-farmer-01",
      name: "Ramesh Tukaram Patil",
      nameHi: "रमेश तुकाराम पाटिल",
      nameMr: "रमेश तुकाराम पाटील",
      phone: "9822012345",
      villageId: "vil-01",
      preferredLanguage: "mr",
      hasSmartphone: false,
      aadhaarLast4: "4821",
      soilType: "Black Cotton Soil (Regur)",
      primaryCrop: "Cotton",
      landSizeAcres: 4.5,
      channelPreference: "IVR_AND_SMS",
      registeredBy: "usr-mitra-01",
      createdAt: "2026-08-01T10:00:00Z"
    },
    {
      id: "frm-02",
      userId: "usr-farmer-02",
      name: "Suresh Chandra Sharma",
      nameHi: "सुरेश चंद्र शर्मा",
      nameMr: "सुरेश चंद्र शर्मा",
      phone: "9876543210",
      villageId: "vil-02",
      preferredLanguage: "hi",
      hasSmartphone: false,
      aadhaarLast4: "7139",
      soilType: "Alluvial Clay Loam",
      primaryCrop: "Soybean",
      landSizeAcres: 3.2,
      channelPreference: "SMS",
      registeredBy: "usr-mitra-01",
      createdAt: "2026-08-02T11:30:00Z"
    },
    {
      id: "frm-03",
      userId: "usr-farmer-03",
      name: "Anand Rao Deshmukh",
      nameHi: "आनंद राव देशमुख",
      nameMr: "आनंद राव देशमुख",
      phone: "9421098765",
      villageId: "vil-03",
      preferredLanguage: "mr",
      hasSmartphone: false,
      aadhaarLast4: "9042",
      soilType: "Deep Medium Black",
      primaryCrop: "Cotton",
      landSizeAcres: 6.0,
      channelPreference: "IVR_AND_SMS",
      registeredBy: "usr-mitra-01",
      createdAt: "2026-08-03T09:15:00Z"
    },
    {
      id: "frm-04",
      userId: "usr-farmer-04",
      name: "Vikram Singh Patel",
      nameHi: "विक्रम सिंह पटेल",
      nameMr: "विक्रम सिंग पटेल",
      phone: "9123456780",
      villageId: "vil-01",
      preferredLanguage: "en",
      hasSmartphone: true,
      aadhaarLast4: "3318",
      soilType: "Clay Loam",
      primaryCrop: "Tomato",
      landSizeAcres: 2.8,
      channelPreference: "WEB_AND_SMS",
      registeredBy: "self",
      createdAt: "2026-08-04T14:20:00Z"
    }
  ],

  farms: [
    {
      id: "farm-01",
      farmerId: "frm-01",
      villageId: "vil-01",
      surveyNumber: "Gat No. 142/2A",
      crop: "Cotton",
      variety: "Bt-Cotton RCH-659",
      sowingDate: "2026-06-12",
      cropStage: "Flowering & Boll Formation",
      areaAcres: 4.5,
      latitude: 20.1712,
      longitude: 73.9882,
      irrigationType: "Drip Irrigation",
      currentRiskLevel: "HIGH",
      currentRiskScore: 78
    },
    {
      id: "farm-02",
      farmerId: "frm-02",
      villageId: "vil-02",
      surveyNumber: "Gat No. 89/1",
      crop: "Soybean",
      variety: "JS-335",
      sowingDate: "2026-06-20",
      cropStage: "Pod Development",
      areaAcres: 3.2,
      latitude: 19.8710,
      longitude: 74.4815,
      irrigationType: "Rainfed + Sprinkler",
      currentRiskLevel: "MEDIUM",
      currentRiskScore: 54
    },
    {
      id: "farm-03",
      farmerId: "frm-03",
      villageId: "vil-03",
      surveyNumber: "Gat No. 204",
      crop: "Cotton",
      variety: "Ajeet 155",
      sowingDate: "2026-06-15",
      cropStage: "Boll Formation",
      areaAcres: 6.0,
      latitude: 19.8920,
      longitude: 74.4765,
      irrigationType: "Canal + Borewell",
      currentRiskLevel: "HIGH",
      currentRiskScore: 82
    },
    {
      id: "farm-04",
      farmerId: "frm-04",
      villageId: "vil-01",
      surveyNumber: "Gat No. 56",
      crop: "Tomato",
      variety: "Abhinav Seminis",
      sowingDate: "2026-07-05",
      cropStage: "Fruit Setting",
      areaAcres: 2.8,
      latitude: 20.1695,
      longitude: 73.9860,
      irrigationType: "Drip Irrigation",
      currentRiskLevel: "HIGH",
      currentRiskScore: 74
    }
  ],

  crops: [
    {
      id: "crop-01",
      name: "Cotton",
      nameHi: "कपास",
      nameMr: "कापूस",
      category: "Cash Crop / Fiber",
      scientificName: "Gossypium hirsutum",
      idealTempMin: 21,
      idealTempMax: 35,
      commonDiseases: ["Pink Bollworm", "Bacterial Blight", "Grey Mildew", "Leaf Curl Virus", "Aphids & Thrips"],
      harvestCycleDays: 160
    },
    {
      id: "crop-02",
      name: "Soybean",
      nameHi: "सोयाबीन",
      nameMr: "सोयाबीन",
      category: "Oilseed / Legume",
      scientificName: "Glycine max",
      idealTempMin: 20,
      idealTempMax: 30,
      commonDiseases: ["Soybean Rust", "Yellow Mosaic Virus", "Anthracnose", "Stem Fly", "Girdle Beetle"],
      harvestCycleDays: 95
    },
    {
      id: "crop-03",
      name: "Wheat",
      nameHi: "गेहूं",
      nameMr: "गहू",
      category: "Cereal",
      scientificName: "Triticum aestivum",
      idealTempMin: 15,
      idealTempMax: 25,
      commonDiseases: ["Yellow Rust", "Brown Rust", "Powdery Mildew", "Loose Smut", "Armyworm"],
      harvestCycleDays: 120
    },
    {
      id: "crop-04",
      name: "Tomato",
      nameHi: "टमाटर",
      nameMr: "टोमॅटो",
      category: "Vegetable",
      scientificName: "Solanum lycopersicum",
      idealTempMin: 18,
      idealTempMax: 28,
      commonDiseases: ["Early Blight", "Late Blight", "Leaf Curl Virus", "Bacterial Wilt", "Fruit Borer"],
      harvestCycleDays: 90
    },
    {
      id: "crop-05",
      name: "Rice",
      nameHi: "धान / चावल",
      nameMr: "भात / तांदूळ",
      category: "Cereal / Grain",
      scientificName: "Oryza sativa",
      idealTempMin: 22,
      idealTempMax: 32,
      commonDiseases: ["Blast Disease", "Brown Spot", "Sheath Blight", "Stem Borer", "Bacterial Leaf Streak"],
      harvestCycleDays: 130
    }
  ],

  disease_reports: [
    {
      id: "rep-01",
      farmerId: "frm-01",
      farmId: "farm-01",
      villageId: "vil-01",
      reporterRole: "agri_mitra",
      reporterId: "usr-mitra-01",
      crop: "Cotton",
      symptomsObserved: "Rosetted flowers, exit holes in young green bolls, small pink larvae visible inside boll",
      symptomsHi: "गुलाब जैसे बंद फूल, छोटे हरे गूलरों में छेद, गूलर के अंदर गुलाबी सुंडी देखी गई",
      symptomsMr: "फुलांचा आकार गुलाबासारखा होणे, बोंडावर बारीक छिद्रे व आत गुलाबी बोंडअळी आढळली",
      reportedVia: "AGRI_MITRA_CSC",
      imageSample: "cotton_pink_bollworm_sample.jpg",
      aiPredictedDisease: "Pink Bollworm Infestation (Pectinophora gossypiella)",
      aiConfidence: 0.94,
      aiRiskLevel: "HIGH",
      aiRecommendation: "Install 5 Pheromone traps/acre. If trap catch exceeds 8 moths/day, spray Profenophos 50% EC @ 30ml/10L or Neem oil 1500ppm.",
      officerVerificationStatus: "VERIFIED",
      verifiedByOfficerId: "usr-officer-01",
      verifiedAt: "2026-08-27T14:30:00Z",
      officerPrescription: "Confirmed severe Pink Bollworm infestation. Approved spray of Profenofos 50% EC (30 ml/10 L water) + install Delta Pheromone traps immediately. Avoid broad-spectrum synthetic pyrethroids to protect predators.",
      officerPrescriptionHi: "गुलाबी सुंडी के गंभीर प्रकोप की पुष्टि। प्रोफेनोफॉस 50% ईसी (30 मिली/10 लीटर पानी) के छिड़काव की सिफारिश + फेरोमोन ट्रैप लगाएं।",
      officerPrescriptionMr: "गुलाबी बोंडअळीच्या प्रादुर्भावाची पुष्टी. प्रोफेनोफॉस ५०% ईसी (३० मिली/१० लिटर पाणी) फवारणी व फेरोमोन सापळे लावण्याचा सल्ला.",
      status: "RESOLVED_WITH_ADVISORY",
      createdAt: "2026-08-27T10:15:00Z"
    },
    {
      id: "rep-02",
      farmerId: "frm-02",
      farmId: "farm-02",
      villageId: "vil-02",
      reporterRole: "farmer",
      reporterId: "usr-farmer-02",
      crop: "Soybean",
      symptomsObserved: "Circular water-soaked brown lesions on lower leaves, defoliation starting",
      symptomsHi: "निचली पत्तियों पर गोल भूरे धब्बे, पत्तियां पीली पड़कर गिरना शुरू",
      symptomsMr: "खालच्या पानांवर तपकिरी चट्टे आणि पाने पिवळी पडून गळण्यास सुरुवात",
      reportedVia: "IVR_KEYPAD",
      imageSample: null,
      aiPredictedDisease: "Soybean Rust / Cercospora Leaf Spot",
      aiConfidence: 0.82,
      aiRiskLevel: "MEDIUM",
      aiRecommendation: "Apply Hexaconazole 5% EC @ 20ml/10L or Mancozeb 75% WP @ 25g/10L upon early leaf lesion symptoms.",
      officerVerificationStatus: "PENDING_VERIFICATION",
      verifiedByOfficerId: null,
      verifiedAt: null,
      officerPrescription: null,
      status: "UNDER_OFFICER_REVIEW",
      createdAt: "2026-08-28T09:00:00Z"
    },
    {
      id: "rep-03",
      farmerId: "frm-03",
      farmId: "farm-03",
      villageId: "vil-03",
      reporterRole: "agri_mitra",
      reporterId: "usr-mitra-01",
      crop: "Cotton",
      symptomsObserved: "Angular water-soaked leaf spots turning blackish-brown with vein blight",
      symptomsHi: "पत्तियों पर कोणीय काले-भूरे धब्बे एवं नसों का काला पड़ना (बैक्टीरियल ब्लाइट)",
      symptomsMr: "पानांवर कोनीय काळे डाग आणि शिरा काळ्या पडणे (बॅक्टेरियल करपा)",
      reportedVia: "AGRI_MITRA_CSC",
      imageSample: "cotton_bacterial_blight.jpg",
      aiPredictedDisease: "Bacterial Blight / Angular Leaf Spot (Xanthomonas citri pv. malvacearum)",
      aiConfidence: 0.89,
      aiRiskLevel: "HIGH",
      aiRecommendation: "Spray Streptocycline 1-2g + Copper Oxychloride 25g in 10L water. Ensure proper field drainage.",
      officerVerificationStatus: "PENDING_VERIFICATION",
      verifiedByOfficerId: null,
      verifiedAt: null,
      officerPrescription: null,
      status: "UNDER_OFFICER_REVIEW",
      createdAt: "2026-08-28T11:45:00Z"
    },
    {
      id: "rep-04",
      farmerId: "frm-04",
      farmId: "farm-04",
      villageId: "vil-01",
      reporterRole: "farmer",
      reporterId: "usr-farmer-04",
      crop: "Tomato",
      symptomsObserved: "Concentric target-like dark brown rings on older leaves, lower foliage drying up",
      symptomsHi: "पुरानी पत्तियों पर गोल छल्लेदार काले धब्बे (टमाटर का अगेती झुलसा)",
      symptomsMr: "जुन्या पानांवर गोलाकार वळ्यांसारखे डाग व पाने जळणे (टोमॅटोचा लवकर येणारा करपा)",
      reportedVia: "WEB_PORTAL",
      imageSample: "tomato_early_blight.jpg",
      aiPredictedDisease: "Tomato Early Blight (Alternaria solani)",
      aiConfidence: 0.91,
      aiRiskLevel: "HIGH",
      aiRecommendation: "Foliar spray of Chlorothalonil 75% WP @ 2g/L or Azoxystrobin 23% SC @ 1ml/L at 7-10 day intervals.",
      officerVerificationStatus: "VERIFIED",
      verifiedByOfficerId: "usr-officer-01",
      verifiedAt: "2026-08-28T13:10:00Z",
      officerPrescription: "Early Blight confirmed. Advised immediate spraying of Azoxystrobin + Difenoconazole @ 1 ml/L. Advise nearby vegetable growers to monitor undersides of foliage.",
      officerPrescriptionHi: "अगेती झुलसा की पुष्टि। एज़ोक्सीस्ट्रोबिन + डिफेनोकोनाज़ोल (1 मिली/लीटर) के छिड़काव की सलाह।",
      officerPrescriptionMr: "टोमॅटो करपा रोगाची पुष्टी. अॅझॉक्सीस्ट्रॉबिन + डायफेनोकोनॅझोल (१ मिली/लिटर) फवारणीचा सल्ला.",
      status: "RESOLVED_WITH_ADVISORY",
      createdAt: "2026-08-28T12:00:00Z"
    }
  ],

  weather_data: [
    {
      id: "wth-01",
      villageId: "vil-01",
      date: "2026-08-28",
      temperatureCelsius: 27.5,
      humidityPercentage: 88,
      rainfallMm: 22.4,
      leafWetnessHours: 8.5,
      windSpeedKmh: 12.0,
      satelliteNdviScore: 0.58, // lower than baseline 0.75 indicates stressed/diseased vegetation
      pestRiskIndex: 78,
      conditionDescription: "Humid & Overcast with high condensation"
    },
    {
      id: "wth-02",
      villageId: "vil-02",
      date: "2026-08-28",
      temperatureCelsius: 29.0,
      humidityPercentage: 72,
      rainfallMm: 6.2,
      leafWetnessHours: 5.0,
      windSpeedKmh: 14.5,
      satelliteNdviScore: 0.69,
      pestRiskIndex: 54,
      conditionDescription: "Partly Cloudy with intermittent breeze"
    },
    {
      id: "wth-03",
      villageId: "vil-03",
      date: "2026-08-28",
      temperatureCelsius: 28.2,
      humidityPercentage: 86,
      rainfallMm: 18.0,
      leafWetnessHours: 9.0,
      windSpeedKmh: 10.2,
      satelliteNdviScore: 0.52,
      pestRiskIndex: 82,
      conditionDescription: "High Humidity & Persistent Foggy Mornings"
    },
    {
      id: "wth-04",
      villageId: "vil-04",
      date: "2026-08-28",
      temperatureCelsius: 32.0,
      humidityPercentage: 45,
      rainfallMm: 0.0,
      leafWetnessHours: 1.5,
      windSpeedKmh: 18.0,
      satelliteNdviScore: 0.81,
      pestRiskIndex: 26,
      conditionDescription: "Dry & Sunny"
    },
    {
      id: "wth-05",
      villageId: "vil-05",
      date: "2026-08-28",
      temperatureCelsius: 26.8,
      humidityPercentage: 78,
      rainfallMm: 11.5,
      leafWetnessHours: 6.8,
      windSpeedKmh: 11.0,
      satelliteNdviScore: 0.66,
      pestRiskIndex: 61,
      conditionDescription: "Mild drizzle with morning dew"
    }
  ],

  alerts: [
    {
      id: "alt-01",
      villageId: "vil-03",
      crop: "Cotton",
      diseaseOrPest: "Pink Bollworm Outbreak Alert",
      diseaseOrPestHi: "गुलाबी सुंडी प्रकोप चेतावनी",
      diseaseOrPestMr: "गुलाबी बोंडअळी प्रादुर्भाव इशारा",
      riskLevel: "HIGH",
      riskScore: 82,
      triggerReason: "Multiple field confirmations + High humidity (86%) + Trap catches > 8 moths",
      sentToFarmerCount: 420,
      channelsDispatched: ["SMS", "VOICE_IVR", "AGRI_MITRA_BROADCAST"],
      broadcastDate: "2026-08-28T08:30:00Z",
      helplineIncluded: "1800-180-1551",
      status: "ACTIVE"
    },
    {
      id: "alt-02",
      villageId: "vil-01",
      crop: "Cotton / Tomato",
      diseaseOrPest: "Fungal Blight & Leaf Spot Early Warning",
      diseaseOrPestHi: "झुलसा व धब्बा रोग पूर्व चेतावनी",
      diseaseOrPestMr: "करपा व पानावरील डाग पूर्वसूचना",
      riskLevel: "HIGH",
      riskScore: 78,
      triggerReason: "Leaf wetness index > 8 hours and NDVI stress anomaly detected via satellite",
      sentToFarmerCount: 510,
      channelsDispatched: ["SMS", "AGRI_MITRA_BROADCAST"],
      broadcastDate: "2026-08-27T16:00:00Z",
      helplineIncluded: "1800-180-1551",
      status: "ACTIVE"
    },
    {
      id: "alt-03",
      villageId: "vil-02",
      crop: "Soybean",
      diseaseOrPest: "Soybean Rust Surveillance Advisory",
      diseaseOrPestHi: "सोयाबीन गेरुआ निगरानी परामर्श",
      diseaseOrPestMr: "सोयाबीन तांबेरा रोग दक्षता सल्ला",
      riskLevel: "MEDIUM",
      riskScore: 54,
      triggerReason: "Weather condition favorable for rust spore germination; monitor lower leaves",
      sentToFarmerCount: 290,
      channelsDispatched: ["SMS"],
      broadcastDate: "2026-08-26T10:00:00Z",
      helplineIncluded: "1800-180-1551",
      status: "MONITORING"
    }
  ],

  ivr_calls: [
    {
      id: "call-01",
      callerPhone: "9822012345",
      farmerName: "Ramesh Tukaram Patil",
      village: "Pimpalgaon Baswant",
      callType: "MISSED_CALL_CALLBACK",
      languageSelected: "mr",
      selectedCrop: "Cotton",
      selectedProblem: "Pink Bollworm / Rosetted flowers",
      durationSeconds: 142,
      advisoryDelivered: "कापूस गुलाबी बोंडअळी प्रादुर्भाव रोखण्यासाठी फेरोमोन सापळे लावा व प्रोफेनोफॉस फवारणी करा. मोफत किसान सुरक्षा हेल्पलाइन: 1800-180-1551",
      status: "COMPLETED",
      timestamp: "2026-08-28T09:40:00Z"
    },
    {
      id: "call-02",
      callerPhone: "9876543210",
      farmerName: "Suresh Chandra Sharma",
      village: "Rahata Rural",
      callType: "INCOMING_DIAL_IN",
      languageSelected: "hi",
      selectedCrop: "Soybean",
      selectedProblem: "Leaf spots / Rust",
      durationSeconds: 110,
      advisoryDelivered: "सोयाबीन पत्तियों पर धब्बों हेतु हेक्साकोनाज़ोल या मैंकोज़ेब का छिड़काव करें। सहायता: 1800-180-1551",
      status: "COMPLETED",
      timestamp: "2026-08-28T10:20:00Z"
    },
    {
      id: "call-03",
      callerPhone: "9421098765",
      farmerName: "Anand Rao Deshmukh",
      village: "Kopargaon North",
      callType: "MISSED_CALL_CALLBACK",
      languageSelected: "mr",
      selectedCrop: "Cotton",
      selectedProblem: "Bacterial Blight",
      durationSeconds: 98,
      advisoryDelivered: "बॅक्टेरियल करपा नियंत्रणासाठी कॉपर ऑक्सिक्लोराईड + स्ट्रेप्टोसायक्लिन फवारावे. मदत: 1800-180-1551",
      status: "COMPLETED",
      timestamp: "2026-08-28T12:05:00Z"
    }
  ],

  sms_logs: [
    {
      id: "sms-01",
      recipientPhone: "9822012345",
      recipientName: "Ramesh Tukaram Patil",
      language: "mr",
      messageContent: "[MR] कापूस कीड इशारा: पिंपळगाव भागात गुलाबी बोंडअळीचा उच्च धोका (७८%) आढळला आहे. पिकाची तपासणी करा व कृषी सहायकाशी संपर्क साधा. मोफत किसान सुरक्षा हेल्पलाइन: 1800-180-1551",
      deliveryStatus: "DELIVERED",
      alertType: "HIGH_RISK_OUTBREAK",
      timestamp: "2026-08-28T08:31:00Z"
    },
    {
      id: "sms-02",
      recipientPhone: "9876543210",
      recipientName: "Suresh Chandra Sharma",
      language: "hi",
      messageContent: "[HI] सोयाबीन फसल सतर्कता: राहाता क्षेत्र में आर्द्रता अधिक होने से फफूंद रोग का मध्यम जोखिम (५४%) है। फसल के निचले पत्तों की जांच करें। सहायता: 1800-180-1551",
      deliveryStatus: "DELIVERED",
      alertType: "WEATHER_ADVISORY",
      timestamp: "2026-08-28T08:31:05Z"
    },
    {
      id: "sms-03",
      recipientPhone: "9421098765",
      recipientName: "Anand Rao Deshmukh",
      language: "mr",
      messageContent: "[MR] आपत्कालीन कीड अलर्ट: कोपरगाव भागात बोंडअळीचा गंभीर उद्रेक (८२%). त्वरित ५ फेरोमोन ट्रॅप लावा. अधिक माहितीसाठी संपर्क करा: 1800-180-1551",
      deliveryStatus: "DELIVERED",
      alertType: "HIGH_RISK_OUTBREAK",
      timestamp: "2026-08-28T08:31:10Z"
    },
    {
      id: "sms-04",
      recipientPhone: "9123456780",
      recipientName: "Vikram Singh Patel",
      language: "en",
      messageContent: "[EN] KrishiRakshak Alert: High Early Blight risk (78%) detected in Pimpalgaon sector. Inspect foliage for concentric rings. Toll-Free Kisan Helpline: 1800-180-1551",
      deliveryStatus: "DELIVERED",
      alertType: "HIGH_RISK_OUTBREAK",
      timestamp: "2026-08-28T08:31:15Z"
    }
  ],

  agri_officers: [
    {
      id: "off-01",
      userId: "usr-officer-01",
      name: "Dr. Rajeshwar K. Verma",
      designation: "District Agriculture Officer (Plant Protection)",
      jurisdictionDistrict: "Nashik & Ahmednagar",
      contactNumber: "9811223344",
      officeLocation: "Agriculture Commissionerate Office, Sector 4",
      verifiedReportsCount: 42,
      activeAlertsIssued: 8
    }
  ],

  field_visits: [
    {
      id: "vis-01",
      agriMitraId: "usr-mitra-01",
      farmerId: "frm-01",
      villageId: "vil-01",
      visitDate: "2026-08-27",
      observations: "Inspected 2 acres of Bt-cotton. 12% flowers show rosette shape. Pheromone trap installation demonstrated to farmer.",
      soilMoisture: "Adequate",
      pestCountPerPlant: 2.4,
      followUpNeeded: true
    },
    {
      id: "vis-02",
      agriMitraId: "usr-mitra-01",
      farmerId: "frm-03",
      villageId: "vil-03",
      visitDate: "2026-08-28",
      observations: "Farmer did not possess a smartphone. Uploaded leaf photograph through CSC tablet for AI disease diagnosis.",
      soilMoisture: "High",
      pestCountPerPlant: 3.1,
      followUpNeeded: true
    }
  ],

  disease_predictions: []
};

module.exports = { initialSeedData };
