import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, CheckCircle2, XCircle, Send, AlertTriangle, FileText, Sparkles, PhoneCall } from 'lucide-react';
import api from '../services/api';
import { useHelpline } from '../context/HelplineContext';

const OfficerVerificationCard = ({ report, onVerified }) => {
  const { t, i18n } = useTranslation();
  const { helpline } = useHelpline();

  const [prescription, setPrescription] = useState(
    report.officerPrescription ||
      `Confirmed ${report.aiPredictedDisease}. Prescribed IPM Spray: Profenofos 50% EC @ 30ml/10L water + Delta Pheromone Traps (5 units/acre).`
  );
  const [confirmedDisease, setConfirmedDisease] = useState(report.aiPredictedDisease || '');
  const [shouldBroadcast, setShouldBroadcast] = useState(true);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const handleVerify = async (status = 'VERIFIED') => {
    setLoading(true);
    try {
      const res = await api.put(`/reports/${report.id}/verify`, {
        status,
        confirmedDisease,
        officerPrescription: prescription,
        officerPrescriptionHi: `पुष्टीकृत: ${confirmedDisease}। अनुमोदित उपचार: ${prescription}`,
        officerPrescriptionMr: `पुष्टी: ${confirmedDisease}. शिफारस: ${prescription}`,
        shouldBroadcastAlert: shouldBroadcast
      });

      setFeedbackMessage({
        type: 'success',
        text: status === 'VERIFIED' ? 'Report verified & advisory dispatched to farmer!' : 'Report closed.'
      });

      if (onVerified) {
        onVerified(res.data.report);
      }
    } catch (e) {
      setFeedbackMessage({ type: 'error', text: e.response?.data?.message || 'Verification failed.' });
    } finally {
      setLoading(false);
    }
  };

  const isAlreadyVerified = report.officerVerificationStatus === 'VERIFIED';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5 space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 text-sm">{report.crop} — {report.villageName}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isAlreadyVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
            }`}>
              {isAlreadyVerified ? '✓ ' + t('officer.verifiedBadge') : '⏳ PENDING OFFICER VERIFICATION'}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Farmer: <strong>{report.farmerName}</strong> ({report.farmerPhone || 'N/A'}) • Reported via {report.reportedVia}
          </p>
        </div>

        <span className="text-[11px] text-slate-400">
          {new Date(report.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* AI Finding vs Human Review Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: AI Finding */}
        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <Sparkles className="w-3.5 h-3.5" />
              AI Automated Diagnosis
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              Confidence: {Math.round((report.aiConfidence || 0.9) * 100)}%
            </span>
          </div>

          <p className="text-sm font-bold text-slate-900">{report.aiPredictedDisease}</p>
          <div className="text-xs text-slate-600">
            <p><strong>Observed Symptoms:</strong> {report.symptomsObserved}</p>
            {report.aiRecommendation && (
              <p className="mt-1 text-slate-700">
                <strong>IPM Recommendation:</strong> {report.aiRecommendation}
              </p>
            )}
          </div>

          <div className="pt-2 text-[10px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 flex items-start gap-1">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>Safety Rule: Chemical spray advisory requires Agriculture Officer approval before farmer SMS broadcast.</span>
          </div>
        </div>

        {/* Right Column: Officer Prescription & Action */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Confirmed Disease Name (Override if required):
            </label>
            <input
              type="text"
              value={confirmedDisease}
              onChange={(e) => setConfirmedDisease(e.target.value)}
              disabled={isAlreadyVerified}
              className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Agriculture Officer Prescription:
            </label>
            <textarea
              rows={3}
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              disabled={isAlreadyVerified}
              placeholder="Enter recommended chemical/organic dosage, pheromone trap instructions, and safety precautions..."
              className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
            />
          </div>

          {!isAlreadyVerified && (
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={shouldBroadcast}
                onChange={(e) => setShouldBroadcast(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Auto-broadcast SMS advisory to all registered farmers in {report.villageName}</span>
            </label>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {!isAlreadyVerified ? (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Advisory will include Kisan Helpline: <strong>{helpline.number}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleVerify('REJECTED')}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors disabled:opacity-50"
            >
              {t('officer.rejectCase')}
            </button>
            <button
              onClick={() => handleVerify('VERIFIED')}
              disabled={loading}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('officer.approveDiagnosis')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 bg-emerald-50/50 p-2.5 rounded-xl">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Prescription verified and active. Farmers in {report.villageName} notified with Kisan Helpline ({helpline.number}).
            </span>
          </div>
        </div>
      )}

      {feedbackMessage && (
        <div className={`p-2.5 rounded-xl text-xs font-semibold ${
          feedbackMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
        }`}>
          {feedbackMessage.text}
        </div>
      )}
    </div>
  );
};

export default OfficerVerificationCard;
