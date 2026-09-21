import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Layers,
  PhoneCall,
  Activity,
  Calendar
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import api from '../services/api';
import { useHelpline } from '../context/HelplineContext';

const AnalyticsDashboard = () => {
  const { t } = useTranslation();
  const { helpline } = useHelpline();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await api.get('/analytics/trends');
      if (res.data && res.data.data) {
        setData(res.data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-purple-700 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>{t('nav.analytics')}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Outbreak Trajectory, Crop Vulnerability & Channel Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Empirical correlation between micro-climate humidity spikes, spore germination and farmer access channels
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold">
          <PhoneCall className="w-4 h-4 text-emerald-700" />
          <span>Kisan Helpline: {helpline.number}</span>
        </div>
      </div>

      {loading || !data ? (
        <div className="text-center py-16 text-xs text-slate-400">Loading Analytics Models...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: 7-Day Outbreak vs Humidity Correlation (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>7-Day Risk Index vs Humidity (%) & Confirmed Outbreak Reports</span>
              </h3>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.weeklyOutbreakTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Line
                    type="monotone"
                    dataKey="riskIndex"
                    name="Risk Index (%)"
                    stroke="#EF4444"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    name="Relative Humidity (%)"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="reports"
                    name="Field Reports"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-500">
              *Observation: When Relative Humidity exceeds 80% on Day 3, risk score spikes above the 70% high-risk threshold within 24 hours.
            </p>
          </div>

          {/* Chart 2: Access Channel Breakdown (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <PieIcon className="w-4 h-4 text-purple-600" />
              <span>Channel Adoption (Smartphone-Free)</span>
            </h3>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.channelBreakdown}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    paddingAngle={4}
                  >
                    {data.channelBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1 text-[11px]">
              {data.channelBreakdown.map((ch, idx) => (
                <div key={ch.name} className="flex justify-between items-center text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                    ></span>
                    {ch.name}
                  </span>
                  <span className="font-bold text-slate-900">{ch.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 3: Crop-wise Vulnerability Stacked Bar (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Crop-wise Threat Segmentation (%)</span>
            </h3>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.cropRisk} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="crop" tick={{ fontSize: 11 }} width={70} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      borderRadius: '0.75rem',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="highRisk" name="High Risk (>70%)" fill="#EF4444" stackId="a" />
                  <Bar dataKey="mediumRisk" name="Medium Risk" fill="#F59E0B" stackId="a" />
                  <Bar dataKey="lowRisk" name="Low Risk (<40%)" fill="#10B981" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Village Risk Rankings Table (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-amber-600" />
              <span>Village Outbreak Vulnerability Index</span>
            </h3>

            <div className="space-y-2">
              {data.villageRankings.map((v) => (
                <div
                  key={v.name}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{v.name}</span>
                    <span className="text-[11px] text-slate-500 block">Monitored: {v.farmerCount} Farmers</span>
                  </div>
                  <span
                    className={`font-mono font-bold px-2.5 py-1 rounded-lg text-xs ${
                      v.riskLevel === 'HIGH'
                        ? 'bg-rose-100 text-rose-800'
                        : v.riskLevel === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {v.riskScore}% ({v.riskLevel})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
