import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  ShieldAlert,
  Thermometer,
  Droplets,
  CloudRain,
  Activity,
  Sparkles,
  RefreshCw,
  PhoneCall,
  Sliders
} from 'lucide-react';
import api from '../services/api';
import { useHelpline } from '../context/HelplineContext';
import GISMap from '../components/GISMap';
import RiskScoreGauge from '../components/RiskScoreGauge';

const GISMapPage = () => {
  const { t, i18n } = useTranslation();
  const { helpline } = useHelpline();

  const [selectedVillage, setSelectedVillage] = useState({
    id: 'vil-01',
    name: 'Pimpalgaon Baswant',
    nameHi: 'पिंपलगांव बसवंत',
    nameMr: 'पिंपळगाव बसवंत',
    district: 'Nashik',
    riskLevel: 'HIGH',
    riskScore: 78,
    primaryCrops: ['Cotton', 'Soybean', 'Tomato'],
    farmerCount: 1420,
    temperature: 27.5,
    humidity: 88,
    leafWetnessHours: 8.5,
    satelliteNdvi: 0.58
  });

  // Simulator controls
  const [simTemp, setSimTemp] = useState(28);
  const [simHumidity, setSimHumidity] = useState(88);
  const [simWetness, setSimWetness] = useState(8.5);
  const [simNdvi, setSimNdvi] = useState(0.55);
  const [simResult, setSimResult] = useState(null);
  const [simulatingOutbreak, setSimulatingOutbreak] = useState(false);
  const [outbreakMessage, setOutbreakMessage] = useState(null);

  useEffect(() => {
    evaluateSimulationParams();
  }, [simTemp, simHumidity, simWetness, simNdvi]);

  const evaluateSimulationParams = async () => {
    try {
      const res = await api.post('/risk/evaluate', {
        temperature: simTemp,
        humidity: simHumidity,
        leafWetnessHours: simWetness,
        satelliteNdvi: simNdvi,
        crop: 'Cotton'
      });
      if (res.data && res.data.evaluation) {
        setSimResult(res.data.evaluation);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTriggerOutbreak = async () => {
    setSimulatingOutbreak(true);
    setOutbreakMessage(null);
    try {
      const res = await api.post('/risk/simulate-outbreak', {
        villageId: selectedVillage?.id || 'vil-01',
        crop: 'Cotton',
        disease: 'Pink Bollworm & Fungal Blight'
      });
      setOutbreakMessage(`🚨 Outbreak triggered in ${res.data.alert?.diseaseOrPest}! Broadcast delivered to farmers.`);
    } catch (e) {
      setOutbreakMessage('Outbreak trigger failed.');
    } finally {
      setSimulatingOutbreak(false);
    }
  };

  const getLocalizedVillageName = () => {
    if (!selectedVillage) return '';
    if (i18n.language === 'mr') return selectedVillage.nameMr || selectedVillage.name;
    if (i18n.language === 'hi') return selectedVillage.nameHi || selectedVillage.name;
    return selectedVillage.name;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>{t('gis.title')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Spatial Village Risk Boundaries & Weather Micro-Climate Telemetry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive Leaflet GeoJSON layer • Multi-parameter risk model with satellite vegetation stress
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>Kisan Helpline: {helpline.number}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <GISMap
            selectedVillageId={selectedVillage?.id}
            onSelectVillage={(v) => setSelectedVillage(v)}
            height="580px"
          />
        </div>

        {/* Right Column: Village Telemetry & Risk Simulator (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Selected Village Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-900">{getLocalizedVillageName()}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedVillage.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedVillage.riskLevel} ({selectedVillage.riskScore}%)
              </span>
            </div>

            <p className="text-xs text-slate-500">
              District: <strong>{selectedVillage.district || 'Nashik'}</strong> • Farmers: {selectedVillage.farmerCount || 1420}
            </p>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900 block">{selectedVillage.temperature || 28}°C</span>
                <span className="text-[10px] text-slate-400">Temperature</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-blue-700 block">{selectedVillage.humidity || 86}%</span>
                <span className="text-[10px] text-slate-400">Humidity</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-teal-700 block">{selectedVillage.leafWetnessHours || 8.0}h</span>
                <span className="text-[10px] text-slate-400">Leaf Wetness</span>
              </div>
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-bold text-emerald-700 block">{selectedVillage.satelliteNdvi || 0.58}</span>
                <span className="text-[10px] text-slate-400">NDVI Score</span>
              </div>
            </div>
          </div>

          {/* Real-time Risk Engine Simulator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-600" />
              <span>Multi-Factor Risk Engine Simulator</span>
            </h3>

            {/* Humidity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Relative Humidity:</span>
                <span className="text-blue-600 font-bold">{simHumidity}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="98"
                value={simHumidity}
                onChange={(e) => setSimHumidity(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Leaf Wetness Hours */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Leaf Wetness:</span>
                <span className="text-teal-600 font-bold">{simWetness} hrs</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={simWetness}
                onChange={(e) => setSimWetness(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
            </div>

            {/* Satellite NDVI Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Satellite NDVI Canopy Health:</span>
                <span className="text-emerald-600 font-bold">{simNdvi}</span>
              </div>
              <input
                type="range"
                min="0.4"
                max="0.85"
                step="0.02"
                value={simNdvi}
                onChange={(e) => setSimNdvi(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Simulated Output Gauge */}
            {simResult && (
              <div className="pt-2">
                <RiskScoreGauge
                  score={simResult.riskScore}
                  level={simResult.riskLevel}
                  label="Simulated Early Warning Score"
                />
              </div>
            )}

            {/* Surge Trigger Button */}
            <button
              onClick={handleTriggerOutbreak}
              disabled={simulatingOutbreak}
              className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-extrabold text-xs rounded-xl shadow transition-transform active:scale-95 flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{simulatingOutbreak ? 'Triggering...' : 'Simulate Outbreak Surge & Alert'}</span>
            </button>

            {outbreakMessage && (
              <p className="text-xs font-semibold text-rose-800 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {outbreakMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GISMapPage;
