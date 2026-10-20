import React, { useState } from 'react';
import { StudentProfile, GameLanguage } from '../../types';
import { TRANSLATIONS } from '../../translations';
import { audioManager } from './audioManager';
import { PauseMenuModal } from './PauseMenuModal';
import { RegionQuestPanel } from './RegionQuestPanel';
import { AchievementsModal } from './AchievementsModal';
import { AuthModal } from '../landing/AuthModal';
import {
  Wallet,
  ShieldAlert,
  Award,
  Globe,
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  Sliders,
  Menu,
  X,
  User,
  Save,
  Trophy,
} from 'lucide-react';

export interface NavbarProps {
  profile: StudentProfile;
  language: GameLanguage;
  onLanguageChange: (lang: GameLanguage) => void;
  onOpenDashboard?: () => void;
  onResetProgress: () => void;
  onReturnToHome: () => void;
  onUpdateProfile?: (profile: StudentProfile, isNewUser?: boolean) => void;
  onSaveProgress?: () => void;
  onResetWallet?: () => void;
  onOpenGameCompletion?: () => void;
  isProgressSaved?: boolean;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  language,
  onLanguageChange,
  onOpenDashboard,
  onResetProgress,
  onReturnToHome,
  onUpdateProfile,
  onSaveProgress,
  onResetWallet,
  onOpenGameCompletion,
  isProgressSaved = false,
  onLogout,
}) => {
  const t = TRANSLATIONS[language].nav;

  // Local state for modals
  const [isPauseMenuOpen, setIsPauseMenuOpen] = useState(false);
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sound state
  const [isMuted, setIsMuted] = useState(() => audioManager.getSettings().isMuted);

  const handleToggleSound = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
  };

  const handleProfileUpdated = (updated: StudentProfile, isNewUser?: boolean) => {
    if (onUpdateProfile) {
      onUpdateProfile(updated, isNewUser);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 px-3 sm:px-6 py-2.5 shadow-xl select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Scholar Profile Button */}
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => {
                audioManager.playClick();
                onReturnToHome();
              }}
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950 text-lg sm:text-xl shadow-md group-hover:scale-105 transition-transform">
                🪙
              </div>
              <div className="hidden sm:block">
                <div className="font-extrabold tracking-tight text-white flex items-center gap-1.5 text-sm sm:text-base">
                  <span className="text-amber-400">MoneyQuest</span>
                </div>
                <div className="text-[11px] text-slate-400">{t.classTag}</div>
              </div>
            </div>

            {/* Pseudonymous Scholar Tag (Clickable to switch profile/login) */}
            <button
              onClick={() => {
                audioManager.playClick();
                setIsAuthOpen(true);
              }}
              title="Click to view/change scholar profile"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 rounded-lg text-xs font-mono text-amber-300 transition"
            >
              <User className="w-3 h-3 text-slate-400" />
              <span>{profile.studentId}</span>
            </button>
          </div>

          {/* Center: Live Financial HUD */}
          <div className="hidden md:flex items-center gap-3 bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs shadow-inner">
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border transition ${
                profile.walletBalance <= 0
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 ring-2 ring-rose-500/50 animate-pulse'
                  : 'text-slate-200 border-transparent'
              }`}
              title="Available Wallet Balance"
            >
              <Wallet className={`w-4 h-4 ${profile.walletBalance <= 0 ? 'text-rose-400' : 'text-emerald-400'}`} />
              <span className="text-slate-400 text-[11px]">{t.wallet}:</span>
              <span className={`font-extrabold ${profile.walletBalance <= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                ₹{profile.walletBalance.toLocaleString('en-IN')}
              </span>
              {profile.walletBalance <= 0 && (
                <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-900/60 px-1.5 py-0.5 rounded border border-rose-500 ml-1">
                  BANKRUPT
                </span>
              )}
              {onResetWallet && profile.walletBalance <= 0 && (
                <button
                  onClick={onResetWallet}
                  title="Emergency Bankruptcy Reset to ₹5,000"
                  className="ml-1 text-[10px] px-2 py-0.5 rounded font-bold transition shadow-sm bg-rose-600 hover:bg-rose-500 text-white border border-rose-400 animate-bounce"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="h-3.5 w-px bg-slate-800" />

            <div className="flex items-center gap-1.5" title="Emergency Savings Reserve">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <span className="text-slate-400 text-[11px]">{t.reserve}:</span>
              <span className="font-extrabold text-sky-400">
                ₹{profile.emergencyFund.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="h-3.5 w-px bg-slate-800" />

            <div className="flex items-center gap-1.5" title="Financial Literacy Score">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400 text-[11px]">{t.score}:</span>
              <span className="font-black text-amber-400">{profile.totalScore}</span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            {/* Quests / World Map Button */}
            <button
              onClick={() => {
                audioManager.playClick();
                setIsQuestsOpen(true);
              }}
              title="View Region Map & Quest Log"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.quests}</span>
            </button>

            {/* Trophies / Achievements Button */}
            <button
              onClick={() => {
                audioManager.playFanfare();
                setIsAchievementsOpen(true);
              }}
              title="View Achievements & Badges"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
            >
              <Award className="w-3.5 h-3.5 text-sky-400" />
              <span>{t.achievements}</span>
            </button>

            {/* Game Completion / Graduation Button */}
            {onOpenGameCompletion && profile.completedCityIds.includes('city_harbor_town') && (
              <button
                onClick={() => {
                  audioManager.playGrandVictoryFanfare();
                  onOpenGameCompletion();
                }}
                title="View Grand Graduation Certificate & Honors"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs rounded-lg shadow-md transition animate-pulse border border-amber-300/60"
              >
                <Trophy className="w-3.5 h-3.5 text-slate-950" />
                <span>Graduation 🏆</span>
              </button>
            )}

            {/* Save Progress Toggle */}
            {onSaveProgress && (
              <button
                onClick={onSaveProgress}
                title={
                  isProgressSaved
                    ? 'Progress is SAVED across reloads (Click to switch to Testing mode)'
                    : 'Testing mode: Wallet & choices reset on reload (Click to save progress)'
                }
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition shadow-sm ${
                  isProgressSaved
                    ? 'bg-emerald-600/80 hover:bg-emerald-600 text-emerald-100 border-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isProgressSaved ? 'Saved' : 'Test Mode'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-xs">
              <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-1 hidden sm:inline" />
              {(['en', 'hi', 'te'] as GameLanguage[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    audioManager.playClick();
                    onLanguageChange(lang);
                  }}
                  className={`px-1.5 py-1 rounded text-[11px] font-bold uppercase transition ${
                    language === lang
                      ? 'bg-amber-500 text-slate-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Pause Menu / Settings Button */}
            <button
              onClick={() => {
                audioManager.playClick();
                setIsPauseMenuOpen(true);
              }}
              title="Open Pause Menu / Settings"
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
            </button>

            {/* Mobile Hamburger Drawer Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 sm:hidden text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Responsive Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2 animate-fadeIn pb-2">
            <div className="flex items-center justify-around bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs mb-2">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">Wallet</span>
                <span className="font-bold text-emerald-400">₹{profile.walletBalance}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">Reserve</span>
                <span className="font-bold text-sky-400">₹{profile.emergencyFund}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 block">Score</span>
                <span className="font-bold text-amber-400">{profile.totalScore}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  audioManager.playClick();
                  setIsQuestsOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.quests}</span>
              </button>

              <button
                onClick={() => {
                  audioManager.playFanfare();
                  setIsAchievementsOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-sky-400" />
                <span>{t.achievements}</span>
              </button>

              {onOpenGameCompletion && profile.completedCityIds.includes('city_harbor_town') && (
                <button
                  onClick={() => {
                    audioManager.playGrandVictoryFanfare();
                    onOpenGameCompletion();
                    setIsMobileMenuOpen(false);
                  }}
                  className="col-span-2 p-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Trophy className="w-3.5 h-3.5 text-slate-950" />
                  <span>Graduation Ceremony 🏆</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Modals rendered through Navbar */}
      <PauseMenuModal
        isOpen={isPauseMenuOpen}
        language={language}
        profile={profile}
        onClose={() => setIsPauseMenuOpen(false)}
        onLanguageChange={onLanguageChange}
        onReturnToHome={onReturnToHome}
        onResetProgress={onResetProgress}
        onOpenQuests={() => setIsQuestsOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onLogout={onLogout}
      />

      <RegionQuestPanel
        isOpen={isQuestsOpen}
        profile={profile}
        language={language}
        onClose={() => setIsQuestsOpen(false)}
      />

      <AchievementsModal
        isOpen={isAchievementsOpen}
        profile={profile}
        language={language}
        onClose={() => setIsAchievementsOpen(false)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        currentProfile={profile}
        language={language}
        onClose={() => setIsAuthOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    </>
  );
};
