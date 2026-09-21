import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  PhoneCall,
  PhoneForwarded,
  MessageSquare,
  Users,
  Scan,
  MapPin,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHelpline } from '../context/HelplineContext';
import RiskScoreGauge from '../components/RiskScoreGauge';
import api from '../services/api';

const LandingPage = ({ onOpenIvr }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { switchDemoRole } = useAuth();
  const { helpline } = useHelpline();

  const [activeAlerts, setActiveAlerts] = useState([]);
  const [stats, setStats] = useState({
    farmers: 1420,
    villages: 5,
    highRisk: 2,
    alertsDispatched: 8
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [alertRes, officerRes] = await Promise.all([
        api.get('/officer/alerts'),
        api.get('/officer/stats')
      ]);
      if (alertRes.data && alertRes.data.alerts) {
        setActiveAlerts(alertRes.data.alerts.slice(0, 3));
      }
      if (officerRes.data && officerRes.data.stats) {
        setStats({
          farmers: officerRes.data.stats.totalFarmers,
          villages: officerRes.data.stats.monitoredVillages,
          highRisk: officerRes.data.stats.highRiskVillages,
          alertsDispatched: officerRes.data.stats.totalSmsDispatched
        });
      }
    } catch (e) {
      // fallback
    }
  };

  const handleLaunchRole = async (role, destinationPath) => {
    await switchDemoRole(role);
    navigate(destinationPath);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 shadow-xl">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>SIH 2026 Problem Statement SIH26131 • Agriculture, FoodTech & Rural Development</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            KrishiRakshak
            <span className="block text-xl sm:text-3xl font-semibold text-emerald-300 mt-2">
              {t('app.tagline')}
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed">
            <strong className="text-amber-300 font-bold">"Smartphone is optional, not a requirement."</strong>{' '}
            High-tech AI, satellite NDVI analytics & GIS early-warning engine decoupled into 5 zero-barrier farmer access channels (IVR, Missed Call, Regional SMS, Agri Mitra CSC, and Web).
          </p>

          {/* Helpline Highlight Card in Hero */}
          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-left">
              <div className="p-3 bg-amber-500 text-slate-950 rounded-xl shadow font-bold">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-amber-300 tracking-wider block">
                  {t('helpline.title')}
                </span>
                <span className="text-2xl font-extrabold text-white tracking-wide block">
                  {helpline.number}
                </span>
                <span className="text-[11px] text-emerald-200/80">Toll-Free • 24x7 In Hindi, Marathi & English</span>
              </div>
            </div>
            <button
              onClick={onOpenIvr}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-transform active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <Radio className="w-4 h-4 text-slate-950" />
              <span>Test IVR Phone Call</span>
            </button>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => handleLaunchRole('farmer', '/farmer')}
              className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center space-x-2"
            >
              <span>🌾 Enter Farmer Advisory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleLaunchRole('agri_mitra', '/agri-mitra')}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center space-x-2"
            >
              <span>🤝 Agri Mitra / CSC Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleLaunchRole('agri_officer', '/officer')}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-600 shadow-lg transition-transform active:scale-95 flex items-center space-x-2"
            >
              <span>👔 Officer Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Live Active Outbreak Alerts Banner */}
      {activeAlerts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-rose-50 border-2 border-rose-300 rounded-3xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-rose-800 font-extrabold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600 animate-pulse" />
                <span>ACTIVE EARLY-WARNING OUTBREAK ADVISORIES IN SECTOR</span>
              </div>
              <span className="text-xs font-bold text-rose-700 bg-rose-200 px-2.5 py-0.5 rounded-full">
                {activeAlerts.length} High-Risk Alert(s)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="bg-white p-3.5 rounded-xl border border-rose-200 shadow-sm space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-900">{alert.villageName}</span>
                    <span className="text-rose-600 font-mono">{alert.riskScore}% Risk</span>
                  </div>
                  <p className="text-xs font-semibold text-rose-800">{alert.diseaseOrPest}</p>
                  <p className="text-[11px] text-slate-500 line-clamp-2">{alert.triggerReason}</p>
                  <div className="text-[10px] text-slate-400 pt-1 flex justify-between border-t border-slate-100">
                    <span>Crop: {alert.crop}</span>
                    <span>Helpline: {helpline.number}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5 Inclusive Channels Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {t('channels.title')}
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto">
            {t('channels.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Channel 1: IVR */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{t('channels.ivrTitle')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('channels.ivrDesc')}</p>
            </div>
            <button
              onClick={onOpenIvr}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl border border-blue-200 transition-colors"
            >
              Open IVR Simulator
            </button>
          </div>

          {/* Channel 2: Missed Call */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <PhoneForwarded className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{t('channels.missedCallTitle')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('channels.missedCallDesc')}</p>
            </div>
            <button
              onClick={onOpenIvr}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 transition-colors"
            >
              Test Missed Call Flow
            </button>
          </div>

          {/* Channel 3: SMS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{t('channels.smsTitle')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('channels.smsDesc')}</p>
            </div>
            <button
              onClick={() => handleLaunchRole('farmer', '/farmer')}
              className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-colors"
            >
              View SMS Inbox
            </button>
          </div>

          {/* Channel 4: Agri Mitra */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{t('channels.agriMitraTitle')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('channels.agriMitraDesc')}</p>
            </div>
            <button
              onClick={() => handleLaunchRole('agri_mitra', '/agri-mitra')}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors"
            >
              Open CSC Portal
            </button>
          </div>

          {/* Channel 5: Web & GIS */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3">
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{t('channels.webTitle')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t('channels.webDesc')}</p>
            </div>
            <Link
              to="/gis-map"
              className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-xl border border-teal-200 transition-colors text-center block"
            >
              Explore GIS Map
            </Link>
          </div>
        </div>
      </section>

      {/* Safety Principle Highlight Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-2 border-emerald-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Core Safety Principle & Human-in-the-Loop Protocol</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              AI Prediction ➔ Expert Agriculture Officer Verification ➔ Localized Advisory
            </h3>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              We never present raw AI predictions as finalized truth. High-confidence CNN detections are flagged as{' '}
              <strong className="text-slate-900">"Pending Officer Verification"</strong>. Only when confirmed by a certified Agriculture Officer is an official chemical/organic prescription dispatched to village farmers via SMS and Voice calls, backed by the 24x7 Kisan Helpline.
            </p>
          </div>

          <Link
            to="/ai-studio"
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow whitespace-nowrap flex items-center space-x-1.5"
          >
            <Scan className="w-4 h-4" />
            <span>Try AI Leaf Studio</span>
          </Link>
        </div>
      </section>

      {/* End-to-End Demo Workflow Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <span>SIH 2026 End-to-End Evaluation Flow</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-emerald-700 block">1. Early Risk Detection</span>
              <p className="text-slate-600">
                Weather sensor & satellite data trigger rising humidity index &gt; 80% in Pimpalgaon.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-amber-700 block">2. Non-Smartphone Access</span>
              <p className="text-slate-600">
                Farmer dials IVR or gives missed call to 1800-180-1551; or visits village Agri Mitra worker.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-blue-700 block">3. AI Scan & Verification</span>
              <p className="text-slate-600">
                Agri Mitra uploads leaf photo. AI predicts Pink Bollworm. Officer reviews & prescribes IPM.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-purple-700 block">4. Multi-Channel Alert</span>
              <p className="text-slate-600">
                Village radius receives targeted SMS in Marathi & Hindi with helpline 1800-180-1551.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
