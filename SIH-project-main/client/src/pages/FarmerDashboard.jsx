import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sprout,
  ShieldAlert,
  CloudRain,
  Thermometer,
  Droplets,
  MessageSquare,
  PhoneCall,
  Send,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHelpline } from '../context/HelplineContext';
import RiskScoreGauge from '../components/RiskScoreGauge';
import VoiceAdvisoryPlayer from '../components/VoiceAdvisoryPlayer';
import api from '../services/api';

const FarmerDashboard = ({ onOpenIvr }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { helpline } = useHelpline();

  const [farmer, setFarmer] = useState(null);
  const [farms, setFarms] = useState([]);
  const [smsLogs, setSmsLogs] = useState([]);
  const [weather, setWeather] = useState(null);
  const [villageRisk, setVillageRisk] = useState(78);
  const [loading, setLoading] = useState(true);

  // Quick report state
  const [symptomText, setSymptomText] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Cotton');
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [farmersRes, farmsRes, smsRes, weatherRes] = await Promise.all([
        api.get('/farmers'),
        api.get('/gis/farms'),
        api.get('/sms/logs'),
        api.get('/risk/villages')
      ]);

      const currentFarmer = farmersRes.data?.farmers?.find((f) => f.userId === user?.id) ||
        farmersRes.data?.farmers?.[0];
      setFarmer(currentFarmer);

      const farmerFarms = farmsRes.data?.farms?.filter((f) => f.farmerId === currentFarmer?.id) ||
        farmsRes.data?.farms || [];
      setFarms(farmerFarms);

      const relevantSms = smsRes.data?.logs || [];
      setSmsLogs(relevantSms.slice(0, 5));

      const vilAssessment = weatherRes.data?.assessments?.find((a) => a?.village?.id === currentFarmer?.villageId) ||
        weatherRes.data?.assessments?.[0];

      if (vilAssessment) {
        setWeather(vilAssessment.weather);
        setVillageRisk(vilAssessment.riskScore);
      }
    } catch (e) {
      console.error('Error fetching farmer dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleReportSymptom = async (e) => {
    e.preventDefault();
    if (!symptomText) return;

    setReportSubmitting(true);
    setReportSuccess(null);

    try {
      const res = await api.post('/reports', {
        crop: selectedCrop,
        symptomsObserved: symptomText,
        symptomsHi: symptomText,
        symptomsMr: symptomText,
        reportedVia: 'WEB_PORTAL',
        villageId: farmer?.villageId || 'vil-01',
        farmerId: farmer?.id || 'frm-01'
      });

      setReportSuccess('Symptoms submitted! Queued for Agriculture Officer review.');
      setSymptomText('');
    } catch (err) {
      setReportSuccess('Submission error: ' + (err.response?.data?.message || err.message));
    } finally {
      setReportSubmitting(false);
    }
  };

  const getAdvisoryText = () => {
    if (i18n.language === 'mr') {
      return `पिंपळगाव परिसरात जास्त दमट हवा (८८%) आणि गुलाबी बोंडअळीचा धोका (७८%) आहे. फेरोमोन सापळे लावा व प्रोफेनोफॉस फवारा. अधिक माहितीसाठी किसान हेल्पलाइन १८००-१८०-१५५१ वर कॉल करा.`;
    }
    if (i18n.language === 'hi') {
      return `पिंपलगांव क्षेत्र में उच्च आर्द्रता (88%) एवं गुलाबी सुंडी का प्रकोप (78%) है। फेरोमोन ट्रैप लगाएं व प्रोफेनोफॉस का छिड़काव करें। टोल-फ्री किसान हेल्पलाइन: 1800-180-1551।`;
    }
    return `High humidity (88%) and pink bollworm infestation threat (78%) in sector. Install 5 pheromone traps/acre and spray Profenofos 50% EC. Toll-Free Kisan Helpline: ${helpline.number}.`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sprout className="w-4 h-4" />
            <span>{t('farmer.myCrops')} • {farmer?.name || 'Ramesh Tukaram Patil'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {t('farmer.currentRisk')}: <span className="text-rose-600">{villageRisk}% (HIGH)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Village: <strong>{farmer?.villageName || 'Pimpalgaon Baswant'}</strong> • Land: {farmer?.landSizeAcres || 4.5} Acres • Preferred: {farmer?.preferredLanguage?.toUpperCase() || 'MR'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenIvr}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{t('nav.ivrDemo')}</span>
          </button>
          <a
            href={`tel:${helpline.number.replace(/[^0-9]/g, '')}`}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Helpline {helpline.number}</span>
          </a>
        </div>
      </div>

      {/* Voice Advisory Bar */}
      <VoiceAdvisoryPlayer
        title="Live Spoken Crop Advisory"
        text={getAdvisoryText()}
        language={farmer?.preferredLanguage || i18n.language}
      />

      {/* Grid: Risk Gauge & Weather Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Risk & Weather (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* Risk Gauge */}
          <RiskScoreGauge
            score={villageRisk}
            level={villageRisk > 70 ? 'HIGH' : villageRisk >= 40 ? 'MEDIUM' : 'LOW'}
            label="Field Outbreak Threat Level"
          />

          {/* Live Micro-Climate & Satellite Status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-600" />
                <span>{t('farmer.weatherAlert')} & Satellite Vegetation Index</span>
              </h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live Open-Meteo API</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <Thermometer className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-lg font-bold text-slate-900 block">{weather?.temperatureCelsius ?? 25.0}°C</span>
                <span className="text-[10px] text-slate-500">Live Temperature</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <Droplets className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-lg font-bold text-slate-900 block">{weather?.humidityPercentage ?? 83}%</span>
                <span className="text-[10px] text-slate-500">Relative Humidity</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <CloudRain className="w-4 h-4 text-teal-600 mx-auto mb-1" />
                <span className="text-lg font-bold text-slate-900 block">{weather?.rainfallMm ?? 0.0} mm</span>
                <span className="text-[10px] text-slate-500">Rainfall (Today)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                <Sprout className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-lg font-bold text-emerald-700 block">{weather?.satelliteNdviScore ?? 0.62}</span>
                <span className="text-[10px] text-slate-500">Canopy NDVI Index</span>
              </div>
            </div>

            <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
              (weather?.humidityPercentage || 80) > 80 ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Real-Time Advisory:</strong> Current relative humidity is <strong>{weather?.humidityPercentage ?? 83}%</strong> with temperature <strong>{weather?.temperatureCelsius ?? 25}°C</strong>. {
                  (weather?.humidityPercentage || 80) > 80
                    ? 'High humidity creates favorable conditions for fungal spore germination. Monitor Cotton/Tomato crops closely.'
                    : 'Weather conditions are stable. Continue standard integrated pest management routine.'
                }
              </span>
            </div>
          </div>

          {/* Registered Plots Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Registered Farm Plots ({farms.length})
            </h3>
            <div className="space-y-2">
              {farms.map((farm) => (
                <div
                  key={farm.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{farm.surveyNumber} — {farm.crop}</span>
                    <span className="text-slate-500 block text-[11px]">
                      Variety: {farm.variety} • Stage: {farm.cropStage} • Area: {farm.areaAcres} Acres
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                    {farm.currentRiskLevel} ({farm.currentRiskScore}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: SMS Inbox & Report Form (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Quick Symptom Report Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>{t('farmer.reportSymptoms')}</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Spotted discoloration or insects? Enter details to notify the District Agriculture Officer.
            </p>

            <form onSubmit={handleReportSymptom} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Crop:</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Cotton">Cotton (कापूस / कपास)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Tomato">Tomato (टोमॅटो / टमाटर)</option>
                  <option value="Wheat">Wheat (गहू / गेहूं)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Symptoms Observed:</label>
                <textarea
                  rows={3}
                  value={symptomText}
                  onChange={(e) => setSymptomText(e.target.value)}
                  placeholder="e.g. Pink worms inside green bolls, circular brown spots on lower leaves..."
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={reportSubmitting || !symptomText}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit to Agriculture Officer</span>
              </button>

              {reportSuccess && (
                <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  {reportSuccess}
                </p>
              )}
            </form>
          </div>

          {/* SMS Alert Inbox */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-600" />
                <span>{t('farmer.recentSms')}</span>
              </h3>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-mono px-2 py-0.5 rounded-full">
                {smsLogs.length} Alerts
              </span>
            </div>

            <div className="space-y-2.5">
              {smsLogs.map((sms) => (
                <div
                  key={sms.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5"
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>Lang: {sms.language?.toUpperCase()}</span>
                    <span>{new Date(sms.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-800 text-[11px] font-sans leading-relaxed">
                    {sms.messageContent}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
