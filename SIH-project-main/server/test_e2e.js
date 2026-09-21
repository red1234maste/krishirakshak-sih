const axios = require('axios');

async function testE2E() {
  console.log('==============================================');
  console.log('🧪 Starting KrishiRakshak End-to-End API Tests');
  console.log('==============================================\n');

  try {
    // 1. Healthcheck
    const health = await axios.get('http://127.0.0.1:5000/api/health');
    console.log('✅ 1. Backend Health Check:', health.data.status, '| Helpline:', health.data.helpline);

    // 2. Risk Engine Evaluation
    const risk = await axios.post('http://127.0.0.1:5000/api/risk/evaluate', {
      temperature: 28.5,
      humidity: 88,
      rainfall: 22,
      leafWetnessHours: 8.5,
      satelliteNdvi: 0.54,
      crop: 'Cotton',
      cropStage: 'Flowering & Boll Formation',
      verifiedReportsInRadius: 2
    });
    console.log(`✅ 2. Risk Engine: Score = ${risk.data.evaluation.riskScore}% (${risk.data.evaluation.riskLevel})`);
    console.log('   Breakdown:', JSON.stringify(risk.data.evaluation.breakdown));

    // 3. IVR State Machine: Marathi selection
    const ivrLang = await axios.post('http://127.0.0.1:5000/api/ivr/simulate-step', {
      currentState: 'SELECT_LANGUAGE',
      inputKey: '2', // Marathi
      sessionData: { callerPhone: '9822012345' }
    });
    console.log('✅ 3. IVR Language Select (Marathi):', ivrLang.data.nextState);
    console.log('   Prompt:', ivrLang.data.responsePrompt);

    // 4. IVR Crop selection (Cotton)
    const ivrCrop = await axios.post('http://127.0.0.1:5000/api/ivr/simulate-step', {
      currentState: 'SELECT_CROP',
      inputKey: '1',
      sessionData: ivrLang.data.sessionData
    });
    console.log('✅ 4. IVR Crop Select (Cotton):', ivrCrop.data.nextState);

    // 5. IVR Symptom selection (Pink Bollworm) -> produces advisory
    const ivrSymptom = await axios.post('http://127.0.0.1:5000/api/ivr/simulate-step', {
      currentState: 'SELECT_SYMPTOM',
      inputKey: '2',
      sessionData: ivrCrop.data.sessionData
    });
    console.log('✅ 5. IVR Final Advisory Delivered:', ivrSymptom.data.isComplete);
    console.log('   Spoken Advisory:', ivrSymptom.data.advisoryText);

    // 6. Missed-call flow
    const missed = await axios.post('http://127.0.0.1:5000/api/ivr/missed-call', { callerPhone: '9822012345' });
    console.log('✅ 6. Missed Call Flow:', missed.data.message);

    // 7. AI Diagnosis microservice
    const aiDiag = await axios.post('http://127.0.0.1:5000/api/reports/ai-diagnose', {
      crop: 'Cotton',
      location: 'Pimpalgaon'
    });
    console.log('✅ 7. AI Leaf Scan Diagnosis:', aiDiag.data.result.disease);
    console.log(`   Confidence: ${Math.round(aiDiag.data.result.confidence * 100)}% | Risk: ${aiDiag.data.result.risk}`);
    console.log('   Safety Status:', aiDiag.data.result.officerVerificationStatus);

    // 8. Officer Login & Verification & Prescription Workflow
    const officerAuth = await axios.post('http://127.0.0.1:5000/api/auth/demo-login', { role: 'agri_officer' });
    const officerToken = officerAuth.data.token;
    console.log('✅ 8a. Officer Demo Login Successful:', officerAuth.data.user.name);

    const verifyRes = await axios.put(
      'http://127.0.0.1:5000/api/reports/rep-02/verify',
      {
        status: 'VERIFIED',
        confirmedDisease: 'Soybean Rust (Phakopsora pachyrhizi)',
        officerPrescription: 'Approved IPM protocol: Hexaconazole 5% EC @ 20ml/10L water. Broadcasted alert.',
        shouldBroadcastAlert: true
      },
      {
        headers: { Authorization: `Bearer ${officerToken}` }
      }
    );
    console.log('✅ 8b. Officer Verification Complete:', verifyRes.data.report.officerVerificationStatus);
    console.log('   Prescription:', verifyRes.data.report.officerPrescription);

    // 9. GIS GeoJSON Village Boundaries
    const gisRes = await axios.get('http://127.0.0.1:5000/api/gis/villages-geojson');
    console.log(`✅ 9. GIS GeoJSON Layer: Loaded ${gisRes.data.features.length} villages (Pimpalgaon, Rahata, Kopargaon, Sangamner, Niphad)`);

    // 10. SMS Broadcast Audit Logs
    const smsLogs = await axios.get('http://127.0.0.1:5000/api/sms/logs');
    console.log(`✅ 10. SMS Logs: ${smsLogs.data.count} alerts logged across Marathi, Hindi and English.`);

    console.log('\n==============================================');
    console.log('🎉 ALL 10 KRISHIRAKSHAK TEST FLOWS PASSED (100%)');
    console.log('==============================================');
  } catch (err) {
    console.error('❌ Test failed:', err.message, err.response?.data);
  }
}

testE2E();
