import React, { useState } from 'react';
import { Volume2, VolumeX, Play, Square, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ttsService from '../services/ttsService';

const VoiceAdvisoryPlayer = ({ text, language = 'hi', title = 'Voice Advisory Player' }) => {
  const { t, i18n } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  const effectiveLang = language || i18n.language || 'hi';

  const handlePlay = () => {
    if (!text) return;
    setIsPlaying(true);
    ttsService.speak(text, effectiveLang, () => {
      setIsPlaying(false);
    });
  };

  const handleStop = () => {
    ttsService.stop();
    setIsPlaying(false);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-4 shadow-md border border-emerald-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex items-center space-x-3 w-full sm:w-auto">
        <div className={`p-2.5 rounded-xl ${isPlaying ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-emerald-800 text-emerald-200'}`}>
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-emerald-100">{title}</span>
            <span className="text-[10px] bg-emerald-800 text-emerald-300 font-mono px-2 py-0.5 rounded-full uppercase">
              {effectiveLang === 'mr' ? 'मराठी' : effectiveLang === 'hi' ? 'हिन्दी' : 'English'}
            </span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-1 max-w-md">
            {text || 'Audio summary not available.'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
        {!isPlaying ? (
          <button
            onClick={handlePlay}
            disabled={!text}
            className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all transform active:scale-95 disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t('farmer.listenVoice')}</span>
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow flex items-center space-x-1.5 transition-all transform active:scale-95"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop Audio</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default VoiceAdvisoryPlayer;
