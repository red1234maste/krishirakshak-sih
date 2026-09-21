import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Users,
  UserPlus,
  Camera,
  ClipboardList,
  CheckCircle2,
  PhoneCall,
  Sprout,
  Send,
  MapPin,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useHelpline } from '../context/HelplineContext';
import { useAuth } from '../context/AuthContext';

const AgriMitraPortal = () => {
  const { t } = useTranslation();
  const { helpline } = useHelpline();
  const { user, isAuthenticated, switchDemoRole } = useAuth();

  const [activeTab, setActiveTab] = useState('REGISTER'); // REGISTER, FIELD_VISITS, AI_ON_BEHALF
  const [farmers, setFarmers] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  // New offline farmer registration form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    villageId: 'vil-01',
    primaryCrop: 'Cotton',
    landSizeAcres: '3.5',
    preferredLanguage: 'mr',
    aadhaarLast4: '',
    surveyNumber: 'Gat No. 120'
  });
  const [regSuccess, setRegSuccess] = useState(null);
  const [regLoading, setRegLoading] = useState(false);

  // Field visit logging form
  const [visitData, setVisitData] = useState({
    farmerId: 'frm-01',
    villageId: 'vil-01',
    observations: '',
    soilMoisture: 'Adequate',
    pestCountPerPlant: '2'
  });
  const [visitSuccess, setVisitSuccess] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fRes, vRes] = await Promise.all([
        api.get('/farmers'),
        api.get('/farmers/field-visits')
      ]);
      setFarmers(fRes.data?.farmers || []);
      setVisits(vRes.data?.visits || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterFarmer = async (e) => {
    e.preventDefault();
    setRegLoading(true);
    setRegSuccess(null);

    try {
      const res = await api.post('/farmers/register-offline', formData);
      setRegSuccess(`Farmer ${res.data.farmer?.name} successfully enrolled! SMS channel activated.`);
      setFormData({
        name: '',
        phone: '',
        villageId: 'vil-01',
        primaryCrop: 'Cotton',
        landSizeAcres: '3.5',
        preferredLanguage: 'mr',
        aadhaarLast4: '',
        surveyNumber: 'Gat No. 120'
      });
      fetchData();
    } catch (err) {
      setRegSuccess('Registration error: ' + (err.response?.data?.message || err.message));
    } finally {
      setRegLoading(false);
    }
  };

  const handleLogVisit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/farmers/field-visits', visitData);
      setVisitSuccess('Field visit inspection recorded.');
      setVisitData({
        farmerId: 'frm-01',
        villageId: 'vil-01',
        observations: '',
        soilMoisture: 'Adequate',
        pestCountPerPlant: '2'
      });
      fetchData();
    } catch (err) {
      setVisitSuccess('Error logging visit');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>{t('agriMitra.title')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Village Level Common Service Centre (CSC) Access Point
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enabling farmers without smartphones to access AI disease detection and officer verified advisory
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>Kisan Helpline: {helpline.number}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('REGISTER')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'REGISTER'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5 inline mr-1" />
          {t('agriMitra.onboardFarmer')}
        </button>
        <button
          onClick={() => setActiveTab('VISITS')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'VISITS'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ClipboardList className="w-3.5 h-3.5 inline mr-1" />
          {t('agriMitra.recentVisits')} ({visits.length})
        </button>
        <button
          onClick={() => setActiveTab('FARMERS')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'FARMERS'
              ? 'bg-amber-500 text-slate-950 shadow'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5 inline mr-1" />
          Registered Farmers ({farmers.length})
        </button>
      </div>

      {/* Tab 1: Onboard Offline Farmer */}
      {activeTab === 'REGISTER' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-amber-600" />
                <span>Register Non-Smartphone Farmer into Early Warning System</span>
              </h3>
            </div>

            {!['agri_mitra', 'agri_officer', 'admin'].includes(user?.role) && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between gap-3">
                <div className="text-xs text-amber-900">
                  <p className="font-bold">⚠️ Authentication Required</p>
                  <p className="text-[11px] text-amber-700">Please log in as an Agri Mitra / Officer to enroll farmers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => switchDemoRole('agri_mitra')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-lg shadow-sm whitespace-nowrap"
                >
                  ⚡ Log In as Agri Mitra
                </button>
              </div>
            )}

            <form onSubmit={handleRegisterFarmer} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('agriMitra.farmerName')}:
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Dattatraya Ganpat Shinde"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('agriMitra.farmerPhone')} (Basic keypad mobile):
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 9822987654"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('agriMitra.village')}:
                  </label>
                  <select
                    value={formData.villageId}
                    onChange={(e) => setFormData({ ...formData, villageId: e.target.value })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="vil-01">Pimpalgaon Baswant (Nashik)</option>
                    <option value="vil-02">Rahata Rural (Ahmednagar)</option>
                    <option value="vil-03">Kopargaon North (Ahmednagar)</option>
                    <option value="vil-04">Sangamner South (Ahmednagar)</option>
                    <option value="vil-05">Niphad Valley (Nashik)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('agriMitra.crop')}:
                  </label>
                  <select
                    value={formData.primaryCrop}
                    onChange={(e) => setFormData({ ...formData, primaryCrop: e.target.value })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Cotton">Cotton (कापूस)</option>
                    <option value="Soybean">Soybean (सोयाबीन)</option>
                    <option value="Tomato">Tomato (टोमॅटो)</option>
                    <option value="Wheat">Wheat (गहू)</option>
                    <option value="Rice">Rice (भात)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('agriMitra.landSize')}:
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.landSizeAcres}
                    onChange={(e) => setFormData({ ...formData, landSizeAcres: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('agriMitra.preferredLang')}:
                  </label>
                  <select
                    value={formData.preferredLanguage}
                    onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                    className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-transform active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>{regLoading ? 'Registering...' : t('agriMitra.submitRegistration')}</span>
              </button>

              {regSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{regSuccess}</span>
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>CSC Village Center Workflow</span>
            </h3>
            <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
              <p>
                <strong>1. Inclusive Onboarding:</strong> Farmers without smart devices are enrolled by their local Agri Mitra. Their language preference (Marathi/Hindi) is recorded.
              </p>
              <p>
                <strong>2. Automated IVR/SMS Linking:</strong> Once registered, the farmer's mobile number receives real-time early warnings, weather alerts, and can dial toll-free <strong>{helpline.number}</strong>.
              </p>
              <p>
                <strong>3. Field Diagnosis on Farmer's Behalf:</strong> When a farmer brings an infected leaf or sample to the CSC center, the worker scans it via the AI Studio.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Recent Visits */}
      {activeTab === 'VISITS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Recorded Field Inspections</h3>
          <div className="space-y-3">
            {visits.map((v) => (
              <div key={v.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-900">{v.farmerName} — {v.villageName}</span>
                  <span className="text-slate-500 font-mono">{v.visitDate}</span>
                </div>
                <p className="text-slate-700">{v.observations}</p>
                <div className="text-[11px] text-slate-500 flex gap-4 pt-1 border-t border-slate-200">
                  <span>Soil Moisture: {v.soilMoisture}</span>
                  <span>Pest Count/Plant: {v.pestCountPerPlant}</span>
                  <span>Follow-up: {v.followUpNeeded ? 'Yes' : 'No'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Registered Farmers List */}
      {activeTab === 'FARMERS' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Enrolled Farmer Network</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {farmers.map((f) => (
              <div key={f.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{f.name}</span>
                  <span className="text-emerald-700">{f.phone}</span>
                </div>
                <p className="text-slate-600">
                  Village: {f.villageName} • Primary Crop: {f.primaryCrop} • {f.landSizeAcres} Acres
                </p>
                <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Language: {f.preferredLanguage?.toUpperCase()}</span>
                  <span>Smartphone: {f.hasSmartphone ? 'Yes' : 'No (Keypad phone)'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgriMitraPortal;
