import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

const RiskScoreGauge = ({ score = 50, level = 'MEDIUM', label = 'Pest & Disease Risk Index' }) => {
  const normalizedScore = Math.max(0, Math.min(100, Math.round(score)));

  let colorClass = 'text-emerald-600 bg-emerald-50 border-emerald-300';
  let barColor = 'bg-emerald-500';
  let Icon = CheckCircle2;
  let statusText = 'LOW RISK (Safe Zone)';

  if (normalizedScore > 70 || level === 'HIGH') {
    colorClass = 'text-rose-600 bg-rose-50 border-rose-300 animate-pulse';
    barColor = 'bg-rose-600';
    Icon = ShieldAlert;
    statusText = 'HIGH RISK 🚨 (Outbreak Threat)';
  } else if (normalizedScore >= 40 || level === 'MEDIUM') {
    colorClass = 'text-amber-600 bg-amber-50 border-amber-300';
    barColor = 'bg-amber-500';
    Icon = AlertTriangle;
    statusText = 'MEDIUM RISK (Surveillance Needed)';
  }

  return (
    <div className={`p-4 rounded-2xl border ${colorClass} shadow-sm transition-all`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{label}</span>
        <span className="inline-flex items-center space-x-1 font-bold text-xs">
          <Icon className="w-3.5 h-3.5" />
          <span>{statusText}</span>
        </span>
      </div>

      <div className="flex items-baseline space-x-2 my-1">
        <span className="text-3xl font-extrabold tracking-tight">{normalizedScore}%</span>
        <span className="text-xs text-slate-500 font-medium">Early Warning Score</span>
      </div>

      {/* Progress Bar with 40% and 70% Threshold Markers */}
      <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative mt-2">
        <div
          className={`h-full transition-all duration-500 ${barColor}`}
          style={{ width: `${normalizedScore}%` }}
        ></div>
        {/* Markers at 40% and 70% */}
        <div className="absolute top-0 bottom-0 left-[40%] w-0.5 bg-slate-400/80"></div>
        <div className="absolute top-0 bottom-0 left-[70%] w-0.5 bg-slate-400/80"></div>
      </div>

      <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
        <span>0% (Low)</span>
        <span>40% (Medium)</span>
        <span>70% (High 🚨)</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default RiskScoreGauge;
