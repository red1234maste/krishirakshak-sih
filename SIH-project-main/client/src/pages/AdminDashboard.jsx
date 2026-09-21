import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  PhoneCall,
  Database,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  MessageSquare,
  Globe
} from 'lucide-react';
import api from '../services/api';
import { useHelpline } from '../context/HelplineContext';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { helpline, updateHelplineNumber, refreshHelpline } = useHelpline();

  const [helplineInput, setHelplineInput] = useState(helpline.number || '1800-180-1551');
  const [helplineNameInput, setHelplineNameInput] = useState(helpline.name || 'Kisan Suraksha Helpline');
  const [updateMsg, setUpdateMsg] = useState(null);
  const [resetMsg, setResetMsg] = useState(null);
  const [smsLogs, setSmsLogs] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [healthRes, smsRes] = await Promise.all([
        api.get('/health'),
        api.get('/sms/logs')
      ]);
      setHealthStatus(healthRes.data);
      setSmsLogs(smsRes.data?.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHelpline = async (e) => {
    e.preventDefault();
    const res = await updateHelplineNumber(helplineInput, helplineNameInput);
    if (res.success) {
      setUpdateMsg({ type: 'success', text: `Helpline updated to ${helplineInput} globally!` });
      refreshHelpline();
    } else {
      setUpdateMsg({ type: 'error', text: res.message || 'Update failed' });
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Reset all 13 collections to pristine SIH 2026 Maharashtra seed dataset?')) return;
    try {
      await api.post('/config/reset-db');
      setResetMsg('Database reset to default seed state with all 13 collections!');
      fetchAdminData();
    } catch (e) {
      setResetMsg('Database reset failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>{t('nav.admin')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            System Administration & Helpline Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure global Kisan hotline, telecom adapters, and seed database state
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Helpline Config & DB Reset (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Toll-Free Helpline Settings */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-amber-600" />
              <span>National Kisan Helpline Settings</span>
            </h3>
            <p className="text-xs text-slate-500">
              This number is injected across all IVR prompts, SMS templates, farmer advisory cards, and landing footers.
            </p>

            <form onSubmit={handleUpdateHelpline} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Helpline Title:</label>
                <input
                  type="text"
                  value={helplineNameInput}
                  onChange={(e) => setHelplineNameInput(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Toll-Free Phone Number:
                </label>
                <input
                  type="text"
                  value={helplineInput}
                  onChange={(e) => setHelplineInput(e.target.value)}
                  placeholder="1800-180-1551"
                  className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-transform active:scale-95"
              >
                Save Helpline Configuration
              </button>

              {updateMsg && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-semibold ${
                    updateMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {updateMsg.text}
                </div>
              )}
            </form>
          </div>

          {/* Database Reset */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-rose-600" />
              <span>Seed Database Reset</span>
            </h3>
            <p className="text-xs text-slate-500">
              Reset all 13 collections (`users, farmers, farms, villages, crops, disease_reports, disease_predictions, weather_data, alerts, agri_officers, field_visits, ivr_calls, sms_logs`) to clean demo state.
            </p>
            <button
              onClick={handleResetDatabase}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-transform active:scale-95"
            >
              Reset to Default Seed Data
            </button>
            {resetMsg && (
              <p className="text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                {resetMsg}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: SMS Delivery Log Audit (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span>SMS Broadcast Audit Logs ({smsLogs.length})</span>
            </h3>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-mono px-2 py-0.5 rounded-full">
              Pluggable Adapter
            </span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
            {smsLogs.map((sms) => (
              <div key={sms.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-slate-900">{sms.recipientName || 'Farmer'} ({sms.recipientPhone})</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                    {sms.deliveryStatus}
                  </span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed font-sans">{sms.messageContent}</p>
                <div className="text-[10px] text-slate-400 flex justify-between pt-1 border-t border-slate-200">
                  <span>Language: {sms.language?.toUpperCase()}</span>
                  <span>{new Date(sms.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
