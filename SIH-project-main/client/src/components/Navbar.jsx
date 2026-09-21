import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Sprout,
  Scan,
  Users,
  MapPin,
  BarChart3,
  PhoneCall,
  Settings,
  UserCheck,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = ({ onOpenIvr }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, switchDemoRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: Sprout },
    { path: '/farmer', label: t('nav.farmerPortal'), icon: ShieldCheck },
    { path: '/ai-studio', label: t('nav.aiStudio'), icon: Scan },
    { path: '/agri-mitra', label: t('nav.agriMitra'), icon: Users },
    { path: '/officer', label: t('nav.officerDashboard'), icon: UserCheck },
    { path: '/gis-map', label: t('nav.gisMap'), icon: MapPin },
    { path: '/analytics', label: t('nav.analytics'), icon: BarChart3 }
  ];

  const handleRoleSwitch = async (role) => {
    await switchDemoRole(role);
    setRoleDropdownOpen(false);

    // Automatically navigate user to the relevant portal
    if (role === 'farmer') navigate('/farmer');
    else if (role === 'agri_mitra') navigate('/agri-mitra');
    else if (role === 'agri_officer') navigate('/officer');
    else if (role === 'admin') navigate('/admin');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'farmer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'agri_mitra':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'agri_officer':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-emerald-900 tracking-tight block leading-tight">
                {t('app.title')}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold tracking-wider uppercase block">
                SIH 2026 • AI Advisory
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center space-x-1.5 px-3 py-2 rounded-md text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 font-bold border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Action Bar: Language Switcher, Role Switcher, IVR Button, Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* IVR Simulator Launch Button */}
            <button
              onClick={onOpenIvr}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-xs rounded-lg border border-amber-300 shadow-sm transition-all"
              title="Open Keypad Phone Simulator"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-700" />
              <span>{t('nav.ivrDemo')}</span>
            </button>

            {/* 1-Click Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold rounded-lg border shadow-sm transition-all ${
                  user ? getRoleBadgeColor(user.role) : 'bg-slate-100 text-slate-800 border-slate-300'
                }`}
              >
                <span>{user ? user.role.replace('_', ' ').toUpperCase() : 'DEMO LOGIN'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('nav.switchRole')}
                  </div>
                  <button
                    onClick={() => handleRoleSwitch('farmer')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center justify-between"
                  >
                    <span>🌾 Farmer (Ramesh Patil)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                      Marathi/Hindi
                    </span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('agri_mitra')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-amber-50 text-slate-700 hover:text-amber-700 flex items-center justify-between"
                  >
                    <span>🤝 Agri Mitra / CSC (Kavita)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                      Village Portal
                    </span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('agri_officer')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-blue-50 text-slate-700 hover:text-blue-700 flex items-center justify-between"
                  >
                    <span>👔 Agri Officer (Dr. Verma)</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                      Verification
                    </span>
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('admin')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-purple-50 text-slate-700 hover:text-purple-700 flex items-center justify-between"
                  >
                    <span>⚙️ Admin Controller</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                      System
                    </span>
                  </button>
                  {isAuthenticated && (
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin link */}
            <Link
              to="/admin"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              title={t('nav.admin')}
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenIvr();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 bg-amber-500 text-slate-950 font-bold rounded-lg text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t('nav.ivrDemo')}</span>
            </button>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <button
                onClick={() => {
                  handleRoleSwitch('farmer');
                  setMobileMenuOpen(false);
                }}
                className="p-2 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 text-center"
              >
                🌾 Demo Farmer
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('agri_mitra');
                  setMobileMenuOpen(false);
                }}
                className="p-2 bg-amber-50 text-amber-800 rounded border border-amber-200 text-center"
              >
                🤝 Demo Agri Mitra
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('agri_officer');
                  setMobileMenuOpen(false);
                }}
                className="p-2 bg-blue-50 text-blue-800 rounded border border-blue-200 text-center"
              >
                👔 Demo Officer
              </button>
              <button
                onClick={() => {
                  handleRoleSwitch('admin');
                  setMobileMenuOpen(false);
                }}
                className="p-2 bg-purple-50 text-purple-800 rounded border border-purple-200 text-center"
              >
                ⚙️ Demo Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
