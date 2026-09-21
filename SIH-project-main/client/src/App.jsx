import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PhoneCall, ShieldCheck, Sprout, Heart } from 'lucide-react';
import Navbar from './components/Navbar';
import HelplineBanner from './components/HelplineBanner';
import IVRSimulatorModal from './components/IVRSimulatorModal';
import LandingPage from './pages/LandingPage';
import FarmerDashboard from './pages/FarmerDashboard';
import AIDiagnosisStudio from './pages/AIDiagnosisStudio';
import AgriMitraPortal from './pages/AgriMitraPortal';
import OfficerDashboard from './pages/OfficerDashboard';
import GISMapPage from './pages/GISMapPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import { useHelpline } from './context/HelplineContext';

function App() {
  const { t, i18n } = useTranslation();
  const { helpline } = useHelpline();
  const [ivrModalOpen, setIvrModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Mandatory Top Helpline Banner */}
      <HelplineBanner onOpenIvr={() => setIvrModalOpen(true)} />

      {/* Main Navbar with trilingual switcher and 1-click role switcher */}
      <Navbar onOpenIvr={() => setIvrModalOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 py-6">
        <Routes>
          <Route path="/" element={<LandingPage onOpenIvr={() => setIvrModalOpen(true)} />} />
          <Route path="/farmer" element={<FarmerDashboard onOpenIvr={() => setIvrModalOpen(true)} />} />
          <Route path="/ai-studio" element={<AIDiagnosisStudio />} />
          <Route path="/agri-mitra" element={<AgriMitraPortal />} />
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/gis-map" element={<GISMapPage />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {/* Interactive Phone IVR Simulator Modal */}
      <IVRSimulatorModal
        isOpen={ivrModalOpen}
        onClose={() => setIvrModalOpen(false)}
      />

      {/* Mandatory Footer with Helpline & SIH Disclaimers */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">KrishiRakshak</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-Powered, Smartphone-Independent Crop Disease & Pest Early Warning System.
              Protecting every farmer through zero-barrier IVR, Missed Call, SMS, and Agri Mitra networks.
            </p>
            <span className="text-[11px] text-emerald-400 font-semibold block">
              SIH 2026 Problem Statement SIH26131
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">Farmer Access Layer</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => setIvrModalOpen(true)} className="hover:text-amber-400 text-left">
                  • IVR Keypad Menu (Hindi/Marathi)
                </button>
              </li>
              <li>
                <button onClick={() => setIvrModalOpen(true)} className="hover:text-amber-400 text-left">
                  • Missed-Call Auto Callback
                </button>
              </li>
              <li>
                <Link to="/farmer" className="hover:text-amber-400">
                  • Multilingual SMS Broadcast
                </Link>
              </li>
              <li>
                <Link to="/agri-mitra" className="hover:text-amber-400">
                  • Agri Mitra Village CSC Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider mb-2">Intelligence Core</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <Link to="/ai-studio" className="hover:text-emerald-400">
                  • OpenCV Lesion Segmentation + CNN
                </Link>
              </li>
              <li>
                <Link to="/gis-map" className="hover:text-emerald-400">
                  • GIS GeoJSON Village Heatmap
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-emerald-400">
                  • Weather & Satellite NDVI Correlation
                </Link>
              </li>
              <li>
                <Link to="/officer" className="hover:text-emerald-400">
                  • Officer Verification & Prescription
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-xs bg-slate-800/60 p-4 rounded-2xl border border-slate-700">
            <h4 className="font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" />
              <span>National Farmer Helpline</span>
            </h4>
            <p className="font-extrabold text-lg text-white font-mono">{helpline.number}</p>
            <p className="text-[11px] text-slate-400">
              Toll-Free • 24x7 Support in Hindi (हिन्दी), Marathi (मराठी), and English.
            </p>
            <p className="text-[10px] text-slate-500 italic">
              Prototype / Simulation for SIH 2026. Certified Agriculture Officer approval required before chemical field spraying.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2026 KrishiRakshak — SIH 2026 Functional Prototype. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built with precision for Indian Agriculture</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
