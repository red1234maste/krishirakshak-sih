import React from 'react';
import { useTranslation } from 'react-i18next';
import { PhoneCall, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { useHelpline } from '../context/HelplineContext';

const HelplineBanner = ({ onOpenIvr }) => {
  const { t, i18n } = useTranslation();
  const { helpline } = useHelpline();

  const getLocalizedName = () => {
    if (i18n.language === 'hi') return helpline.nameHi || helpline.name;
    if (i18n.language === 'mr') return helpline.nameMr || helpline.name;
    return helpline.name;
  };

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-emerald-900 text-white shadow-md border-b border-emerald-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-700/80 rounded-full shadow-inner animate-pulse">
            <PhoneCall className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200 bg-emerald-950/60 px-2 py-0.5 rounded">
                {t('helpline.badge')}
              </span>
              <span className="font-bold text-sm sm:text-base tracking-wide">
                {getLocalizedName()}:{' '}
                <a
                  href={`tel:${helpline.number.replace(/[^0-9]/g, '')}`}
                  className="underline hover:text-emerald-200 font-extrabold text-amber-300 ml-1"
                >
                  {helpline.number}
                </a>
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 hidden sm:block">
              {helpline.timings} • {helpline.disclaimer}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onOpenIvr && (
            <button
              onClick={onOpenIvr}
              className="inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-full shadow transition-all transform hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('nav.ivrDemo')}</span>
            </button>
          )}
          <a
            href={`tel:${helpline.number.replace(/[^0-9]/g, '')}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-full border border-emerald-400/50 shadow transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t('helpline.callNow')}</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelplineBanner;
