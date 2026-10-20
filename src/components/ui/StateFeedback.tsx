import React, { useState, useEffect } from 'react';
import { GameLanguage } from '../../types';
import { TRANSLATIONS } from '../../translations';
import { AlertTriangle, RefreshCw, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import { audioManager } from './audioManager';

interface LoadingScreenProps {
  language?: GameLanguage;
  message?: string;
}

export const GameLoadingScreen: React.FC<LoadingScreenProps> = ({
  language = 'en',
  message,
}) => {
  const t = TRANSLATIONS[language].feedback;
  const tips = [
    'Always set aside 20% of your ₹5,000 stipend before paying discretionary expenses.',
    'Never enter your UPI PIN to RECEIVE money. PIN is strictly required for sending.',
    'Compounding turns small monthly savings into financial freedom over time.',
    'Emergency funds prevent you from taking high-interest loans for unexpected repairs.',
  ];

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [tips.length]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md text-white p-6">
      {/* Animated Coin */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-4xl shadow-2xl shadow-amber-500/40 animate-bounce border-2 border-amber-300">
          🪙
        </div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-3 bg-black/40 rounded-full blur-sm" />
      </div>

      <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2 text-slate-100 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
        {message || t.loadingTitle}
      </h2>

      {/* Progress Bar Animation */}
      <div className="w-64 sm:w-80 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-6">
        <div className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-full animate-pulse w-3/4" />
      </div>

      {/* Rotating Financial Literacy Tip */}
      <div className="max-w-md text-center bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-300 flex items-center gap-2.5 shadow-lg">
        <HelpCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
        <span>{tips[tipIndex]}</span>
      </div>
    </div>
  );
};

interface ErrorStateProps {
  language?: GameLanguage;
  error?: string;
  onRetry?: () => void;
}

export const GameErrorState: React.FC<ErrorStateProps> = ({
  language = 'en',
  error,
  onRetry,
}) => {
  const t = TRANSLATIONS[language].feedback;

  const handleRetry = () => {
    audioManager.playClick();
    if (onRetry) onRetry();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/90 border border-rose-500/40 rounded-2xl max-w-lg mx-auto text-center shadow-2xl my-8">
      <div className="w-14 h-14 rounded-full bg-rose-950/80 border border-rose-500/50 flex items-center justify-center text-rose-400 mb-4">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-2">{t.errorTitle}</h3>
      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
        {error || t.errorSub}
      </p>

      <div className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-xs text-amber-400/90 mb-6 flex items-center gap-2 justify-center">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>{t.offlineModeActive}</span>
      </div>

      {onRetry && (
        <button
          onClick={handleRetry}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t.retryBtn}</span>
        </button>
      )}
    </div>
  );
};

interface EmptyStateProps {
  language?: GameLanguage;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const GameEmptyState: React.FC<EmptyStateProps> = ({
  language = 'en',
  title,
  description,
  actionText,
  onAction,
}) => {
  const t = TRANSLATIONS[language].feedback;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-950/40 border border-dashed border-slate-800 rounded-2xl text-center max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-2xl mb-3">
        📜
      </div>
      <h4 className="font-bold text-slate-200 mb-1">{title || t.emptyTitle}</h4>
      <p className="text-xs text-slate-400 mb-4 max-w-xs">{description || t.emptySub}</p>
      {actionText && onAction && (
        <button
          onClick={() => {
            audioManager.playClick();
            onAction();
          }}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
