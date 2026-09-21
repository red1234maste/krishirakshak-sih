import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { updatePreferredLanguage } = useAuth();

  const languages = [
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' }
  ];

  const handleLanguageChange = (langCode) => {
    updatePreferredLanguage(langCode);
  };

  return (
    <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center px-1.5 text-slate-500">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <div className="flex space-x-1">
        {languages.map((lang) => {
          const isActive = i18n.language === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
              title={`Switch language to ${lang.label}`}
            >
              <span className="mr-1">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
