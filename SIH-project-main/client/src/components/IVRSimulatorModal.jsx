import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  X,
  Phone,
  PhoneOff,
  PhoneCall,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock,
  Sparkles,
  Signal,
  BatteryCharging,
  Info
} from 'lucide-react';
import api from '../services/api';
import ttsService from '../services/ttsService';
import { useHelpline } from '../context/HelplineContext';

const IVRSimulatorModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { helpline } = useHelpline();

  const [callActive, setCallActive] = useState(false);
  const [callState, setCallState] = useState('IDLE'); // IDLE, RINGING, CONNECTED, ENDED
  const [ivrStep, setIvrStep] = useState('START');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [sessionData, setSessionData] = useState({
    language: 'hi',
    crop: null,
    symptom: null,
    callerPhone: '9822012345'
  });
  const [keypadInput, setKeypadInput] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeTab, setActiveTab] = useState('DIALER'); // DIALER or LOGS
  const [callLogs, setCallLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [missedCallMessage, setMissedCallMessage] = useState(null);

  useEffect(() => {
    if (isOpen && activeTab === 'LOGS') {
      fetchLogs();
    }
  }, [isOpen, activeTab]);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await api.get('/ivr/logs');
      if (res.data && res.data.logs) {
        setCallLogs(res.data.logs);
      }
    } catch (e) {
      console.error('Failed to fetch IVR logs', e);
    } finally {
      setLoadingLogs(false);
    }
  };

  const startCall = async () => {
    setMissedCallMessage(null);
    setCallState('CONNECTING');
    setCallActive(true);

    try {
      const res = await api.post('/ivr/simulate-step', {
        currentState: 'START',
        inputKey: null,
        sessionData: { language: 'hi', callerPhone: '9822012345' }
      });

      setCallState('CONNECTED');
      setIvrStep(res.data.nextState);
      setCurrentPrompt(res.data.responsePrompt);
      setSessionData(res.data.sessionData);

      if (audioEnabled) {
        speakPrompt(res.data.responsePrompt, 'hi');
      }
    } catch (e) {
      console.error(e);
      setCallState('CONNECTED');
      setCurrentPrompt(`Welcome to Kisan Suraksha Helpline (${helpline.number}). Press 1 for Hindi, 2 for Marathi, 3 for English.`);
      setIvrStep('SELECT_LANGUAGE');
    }
  };

  const endCall = () => {
    ttsService.stop();
    setIsSpeaking(false);
    setCallState('ENDED');
    setTimeout(() => {
      setCallActive(false);
      setCallState('IDLE');
      setIvrStep('START');
      setCurrentPrompt('');
      setKeypadInput('');
    }, 1200);
  };

  const handleKeyPress = async (key) => {
    if (!callActive || callState !== 'CONNECTED') return;

    setKeypadInput((prev) => prev + key);

    try {
      const res = await api.post('/ivr/simulate-step', {
        currentState: ivrStep,
        inputKey: key,
        sessionData
      });

      setIvrStep(res.data.nextState);
      setCurrentPrompt(res.data.responsePrompt);
      setSessionData(res.data.sessionData);

      const voiceLang = res.data.sessionData?.language || 'hi';
      if (audioEnabled) {
        speakPrompt(res.data.responsePrompt, voiceLang);
      }
    } catch (e) {
      console.error('Step execution error', e);
    }
  };

  const speakPrompt = (text, lang) => {
    setIsSpeaking(true);
    ttsService.speak(text, lang, () => {
      setIsSpeaking(false);
    });
  };

  const triggerMissedCallFlow = async () => {
    setMissedCallMessage({ status: 'calling', text: 'Dialing missed call to Kisan Helpline 1800-180-1551...' });

    try {
      const res = await api.post('/ivr/missed-call', { callerPhone: '9822012345' });
      setMissedCallMessage({
        status: 'received',
        text: `Missed call registered! Auto-callback incoming in 3 seconds...`
      });

      setTimeout(() => {
        setMissedCallMessage(null);
        startCall();
      }, 3000);
    } catch (e) {
      setMissedCallMessage({ status: 'error', text: 'Missed call simulation failed.' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                Smartphone-Independent IVR & Missed Call Simulator
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                  SIH26131 Mock
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Toll-Free Kisan Suraksha Hotline: <strong className="text-amber-300">{helpline.number}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              ttsService.stop();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 pb-1 bg-slate-800/40 border-b border-slate-800 flex space-x-2">
          <button
            onClick={() => setActiveTab('DIALER')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'DIALER' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📱 Phone Dialer Simulator
          </button>
          <button
            onClick={() => setActiveTab('LOGS')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'LOGS' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 IVR & Missed Call Logs ({callLogs.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'DIALER' ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Feature Phone Mockup */}
              <div className="md:col-span-7 bg-slate-950 border-4 border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col items-center">
                {/* Phone Speaker & Top Bar */}
                <div className="w-16 h-1.5 bg-slate-700 rounded-full mb-3"></div>
                <div className="w-full flex justify-between text-[11px] text-slate-400 px-2 mb-1">
                  <span className="flex items-center gap-1">
                    <Signal className="w-3 h-3 text-emerald-400" /> BSNL / Jio 4G
                  </span>
                  <span className="font-mono">{helpline.number}</span>
                  <span className="flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3 text-emerald-400" /> 98%
                  </span>
                </div>

                {/* Phone Screen */}
                <div className="w-full bg-emerald-950/70 border border-emerald-800 rounded-xl p-3 text-emerald-200 min-h-[160px] flex flex-col justify-between mb-4 shadow-inner relative overflow-hidden">
                  <div className="flex justify-between items-center text-[10px] text-emerald-400/80 border-b border-emerald-800/60 pb-1 mb-1">
                    <span>
                      {callState === 'CONNECTED'
                        ? '🟢 Call in progress'
                        : callState === 'CONNECTING'
                        ? '🟡 Dialing...'
                        : '⚪ Standby / Ready'}
                    </span>
                    <span className="font-bold">{sessionData.language?.toUpperCase() || 'HI'}</span>
                  </div>

                  <div className="text-xs font-mono leading-relaxed py-1">
                    {callState === 'CONNECTED' ? (
                      <div className="space-y-1">
                        <p className="text-emerald-100 font-semibold">{currentPrompt}</p>
                        {isSpeaking && (
                          <div className="flex items-center space-x-1.5 text-amber-300 text-[11px] animate-pulse mt-2">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Audio playing in {sessionData.language?.toUpperCase()}...</span>
                          </div>
                        )}
                      </div>
                    ) : callState === 'CONNECTING' ? (
                      <p className="text-center py-6 text-emerald-300 animate-pulse">
                        Connecting to Kisan Suraksha Toll-Free Line ({helpline.number})...
                      </p>
                    ) : callState === 'ENDED' ? (
                      <p className="text-center py-6 text-rose-300">Call Ended. Thank you.</p>
                    ) : (
                      <div className="text-center py-4 space-y-1 text-emerald-300/80">
                        <p className="font-bold text-sm text-emerald-200">Kisan Suraksha 24x7</p>
                        <p className="text-[11px]">Dial {helpline.number} or give a missed call</p>
                        <p className="text-[10px] text-emerald-400/60">Works on all basic keypad mobile phones</p>
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-emerald-400/70 border-t border-emerald-800/60 pt-1 flex justify-between">
                    <span>Menu Step: {ivrStep}</span>
                    <span>Keys: {keypadInput || 'None'}</span>
                  </div>
                </div>

                {/* Keypad Buttons */}
                <div className="grid grid-cols-3 gap-2 w-full max-w-[260px] mb-3">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                    <button
                      key={k}
                      onClick={() => handleKeyPress(k)}
                      disabled={!callActive || callState !== 'CONNECTED'}
                      className="h-11 bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 disabled:opacity-40 rounded-xl font-mono font-bold text-base text-slate-200 border border-slate-600 shadow transition-all flex flex-col items-center justify-center"
                    >
                      <span>{k}</span>
                    </button>
                  ))}
                </div>

                {/* Call & End Buttons */}
                <div className="flex space-x-3 w-full max-w-[260px]">
                  {!callActive ? (
                    <button
                      onClick={startCall}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-transform active:scale-95"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Dial {helpline.shortCode || '1551'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={endCall}
                      className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-transform active:scale-95"
                    >
                      <PhoneOff className="w-4 h-4" />
                      <span>End Call</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Simulation Controls & Walkthrough Explanation */}
              <div className="md:col-span-5 space-y-4">
                {/* Missed Call Simulation Box */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-2.5 shadow">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <h4>Missed Call Flow Simulation</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A farmer gives a missed call to toll-free <strong>{helpline.number}</strong>. The system detects the caller number, schedules a callback, and starts the automated advisory.
                  </p>
                  <button
                    onClick={triggerMissedCallFlow}
                    disabled={callActive}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                  >
                    📞 Simulate Giving Missed Call
                  </button>
                  {missedCallMessage && (
                    <div className="p-2 bg-slate-900 text-amber-300 rounded-lg text-xs font-mono border border-amber-500/30 animate-pulse">
                      {missedCallMessage.text}
                    </div>
                  )}
                </div>

                {/* Audio voice toggle */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs">
                    {audioEnabled ? (
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="font-semibold text-slate-200">Browser TTS Voice Output</span>
                  </div>
                  <button
                    onClick={() => {
                      if (audioEnabled) ttsService.stop();
                      setAudioEnabled(!audioEnabled);
                    }}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                      audioEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-700 text-slate-400 border-slate-600'
                    }`}
                  >
                    {audioEnabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Keypad Menu Guide */}
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-3 text-xs space-y-1.5">
                  <div className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-400" />
                    <span>State Machine Guide:</span>
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                    <li>
                      <strong>Step 1:</strong> Press 1 (Hindi), 2 (Marathi), 3 (English)
                    </li>
                    <li>
                      <strong>Step 2:</strong> Press 1 (Cotton), 2 (Soybean), 3 (Wheat), 4 (Tomato)
                    </li>
                    <li>
                      <strong>Step 3:</strong> Press 1 (Leaf Spots), 2 (Pink Bollworm), 3 (Wilting)
                    </li>
                    <li>
                      <strong>Step 4:</strong> Spoken + Text Advisory with Helpline 1800-180-1551
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            /* Logs Tab */
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Logged IVR & Missed Call Interactions
                </span>
                <button
                  onClick={fetchLogs}
                  className="inline-flex items-center space-x-1 text-xs text-amber-400 hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              {loadingLogs ? (
                <p className="text-xs text-slate-400 py-6 text-center">Loading call logs...</p>
              ) : callLogs.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No call logs registered yet.</p>
              ) : (
                <div className="space-y-2">
                  {callLogs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5" />
                          {log.farmerName || 'Caller'} ({log.callerPhone})
                        </span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono">
                          {log.callType}
                        </span>
                      </div>
                      <div className="text-slate-300 text-[11px] grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-slate-400">Crop:</span> {log.selectedCrop || 'N/A'}
                        </div>
                        <div>
                          <span className="text-slate-400">Language:</span>{' '}
                          {log.languageSelected?.toUpperCase() || 'HI'}
                        </div>
                      </div>
                      {log.advisoryDelivered && (
                        <p className="text-amber-200/90 text-[11px] bg-slate-900/60 p-2 rounded border border-slate-700/50">
                          📢 {log.advisoryDelivered}
                        </p>
                      )}
                      <div className="text-[10px] text-slate-500 flex justify-between">
                        <span>Duration: {log.durationSeconds || 0}s</span>
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IVRSimulatorModal;
