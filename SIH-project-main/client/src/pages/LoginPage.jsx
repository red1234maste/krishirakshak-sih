import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Phone, Lock, ArrowRight, UserCheck, Users, Sprout, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHelpline } from '../context/HelplineContext';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, switchDemoRole, loading } = useAuth();
  const { helpline } = useHelpline();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(phone, password);
    if (res.success) {
      if (res.user.role === 'farmer') navigate('/farmer');
      else if (res.user.role === 'agri_mitra') navigate('/agri-mitra');
      else if (res.user.role === 'agri_officer') navigate('/officer');
      else navigate('/admin');
    } else {
      setError(res.message);
    }
  };

  const handleDemoLogin = async (role, destination) => {
    const res = await switchDemoRole(role);
    if (res.success) {
      navigate(destination);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">{t('app.title')} Login</h1>
        <p className="text-xs text-slate-500">{t('app.tagline')}</p>
      </div>

      {/* 1-Click Role Quick Access Box */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2.5 shadow-sm">
        <span className="text-xs font-extrabold text-amber-900 block">⚡ Instant 1-Click Demo Evaluation Login:</span>
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={() => handleDemoLogin('farmer', '/farmer')}
            className="p-2.5 bg-white hover:bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-300 shadow-sm text-left flex items-center justify-between"
          >
            <span>🌾 Farmer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDemoLogin('agri_mitra', '/agri-mitra')}
            className="p-2.5 bg-white hover:bg-amber-50 text-amber-800 rounded-xl border border-amber-300 shadow-sm text-left flex items-center justify-between"
          >
            <span>🤝 Agri Mitra</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDemoLogin('agri_officer', '/officer')}
            className="p-2.5 bg-white hover:bg-blue-50 text-blue-800 rounded-xl border border-blue-300 shadow-sm text-left flex items-center justify-between"
          >
            <span>👔 Agri Officer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDemoLogin('admin', '/admin')}
            className="p-2.5 bg-white hover:bg-purple-50 text-purple-800 rounded-xl border border-purple-300 shadow-sm text-left flex items-center justify-between"
          >
            <span>⚙️ Admin</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Standard Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number:</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9822012345"
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Default demo password: password123</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow transition-transform active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : t('nav.login')}
          </button>

          {error && (
            <p className="text-xs font-semibold text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {error}
            </p>
          )}
        </form>

        <div className="pt-2 text-center text-xs text-slate-500">
          Helpline Support: <strong>{helpline.number}</strong>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
