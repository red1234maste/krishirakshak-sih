const db = require('../config/db');
const { processIvrStep, handleMissedCall, IVR_FLOW } = require('../services/ivrStateMachine');
const { getHelplineConfig } = require('../config/helpline');

const simulateIvrStep = (req, res) => {
  const { currentState = 'START', inputKey = null, sessionData } = req.body;
  const result = processIvrStep({ currentState, inputKey, sessionData });
  return res.json({
    success: true,
    ...result
  });
};

const triggerMissedCall = (req, res) => {
  const { callerPhone = '9822012345' } = req.body;
  const result = handleMissedCall(callerPhone);
  return res.json({
    success: true,
    ...result
  });
};

const getCallLogs = (req, res) => {
  const logs = db.get('ivr_calls');
  return res.json({
    success: true,
    count: logs.length,
    helpline: getHelplineConfig().number,
    logs
  });
};

const getIvrFlowSchema = (req, res) => {
  return res.json({
    success: true,
    helpline: getHelplineConfig().number,
    flow: IVR_FLOW
  });
};

module.exports = {
  simulateIvrStep,
  triggerMissedCall,
  getCallLogs,
  getIvrFlowSchema
};
