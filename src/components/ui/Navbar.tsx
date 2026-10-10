import React from 'react';
import { StudentProfile, GameLanguage } from '../../types';
import { Wallet, ShieldAlert, Award, Globe, BarChart3, RotateCcw } from 'lucide-react';

interface NavbarProps {
  profile: StudentProfile;
  language: GameLanguage;
  onLanguageChange: (lang: GameLanguage) => void;
  onOpenDashboard: () => void;
  onResetProgress: () => void;
  onReturnToHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  language,
  onLanguageChange,
  onOpenDashboard,
  onResetProgress,
  onReturnToHome,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Game Title & Pseudonymous ID */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReturnToHome}>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950 text-xl shadow-md">
            🪙
          </div>
          <div>
            <div className="font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-amber-400 font-extrabold">MoneyQuest</span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                {profile.studentId}
              </span>
            </div>
            <div className="text-xs text-slate-400">Class 11 Scholar • Hyderabad</div>
          </div>
        </div>

        {/* Financial HUD */}
        <div className="flex items-center gap-4 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-slate-800 text-sm">
          <div className="flex items-center gap-1.5" title="Available Wallet Balance">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-400 text-xs">Wallet:</span>
            <span className="font-semibold text-emerald-400">₹{profile.walletBalance.toLocaleString('en-IN')}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-1.5" title="Emergency Savings Fund">
            <ShieldAlert className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400 text-xs">Reserve:</span>
            <span className="font-semibold text-sky-400">₹{profile.emergencyFund.toLocaleString('en-IN')}</span>
          </div>

          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center gap-1.5" title="Literacy Score">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-xs">Score:</span>
            <span className="font-bold text-amber-400">{profile.totalScore}</span>
          </div>
        </div>

        {/* Controls: Language, NGO Dashboard & Reset */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded font-medium transition ${
                language === 'en' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2 py-1 rounded font-medium transition ${
                language === 'hi' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              HI
            </button>
            <button
              onClick={() => onLanguageChange('te')}
              className={`px-2 py-1 rounded font-medium transition ${
                language === 'te' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              TE
            </button>
          </div>

          {/* NGO Reporting Dashboard Button */}
          <button
            onClick={onOpenDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-indigo-100 rounded-lg text-xs font-semibold border border-indigo-500/30 transition shadow-sm"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">NGO Dashboard</span>
          </button>

          {/* Reset Progress */}
          <button
            onClick={onResetProgress}
            title="Reset Game Progress"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
