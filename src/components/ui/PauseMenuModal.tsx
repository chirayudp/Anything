import React, { useState, useEffect } from 'react';
import { GameLanguage, StudentProfile } from '../../types';
import { TRANSLATIONS } from '../../translations';
import { audioManager } from './audioManager';
import {
  Volume2,
  VolumeX,
  Music,
  Bell,
  Eye,
  Sliders,
  Keyboard,
  Smartphone,
  Play,
  RotateCcw,
  Home,
  X,
  Globe,
  Compass,
  Award,
  BarChart3,
} from 'lucide-react';

interface PauseMenuModalProps {
  isOpen: boolean;
  language: GameLanguage;
  profile: StudentProfile;
  onClose: () => void;
  onLanguageChange: (lang: GameLanguage) => void;
  onReturnToHome: () => void;
  onResetProgress: () => void;
  onOpenQuests?: () => void;
  onOpenAchievements?: () => void;
  onOpenDashboard?: () => void;
  onLogout?: () => void;
}

export const PauseMenuModal: React.FC<PauseMenuModalProps> = ({
  isOpen,
  language,
  profile,
  onClose,
  onLanguageChange,
  onReturnToHome,
  onResetProgress,
  onOpenQuests,
  onOpenAchievements,
  onOpenDashboard,
  onLogout,
}) => {
  const t = TRANSLATIONS[language].pause;
  const [activeTab, setActiveTab] = useState<'settings' | 'controls'>('settings');

  // Audio settings
  const [audioSettings, setAudioSettings] = useState(() => audioManager.getSettings());
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [retroFont, setRetroFont] = useState(false);

  // Keyboard shortcut listener for ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isOpen) {
          audioManager.playClick();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    audioManager.toggleMute();
    setAudioSettings(audioManager.getSettings());
    audioManager.playClick();
  };

  const handleToggleBgm = () => {
    audioManager.toggleBgm();
    setAudioSettings(audioManager.getSettings());
    audioManager.playClick();
  };

  const handleToggleSfx = () => {
    audioManager.toggleSfx();
    setAudioSettings(audioManager.getSettings());
    audioManager.playClick();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioManager.setVolume(val);
    setAudioSettings(audioManager.getSettings());
  };

  const handleTestSound = () => {
    audioManager.playCoin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="max-w-xl w-full bg-slate-900 border-2 border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            audioManager.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-md">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">{t.menuTitle}</h3>
            <p className="text-xs text-slate-400">
              Student {profile.studentId} • ₹{profile.walletBalance.toLocaleString('en-IN')} Wallet
            </p>
          </div>
        </div>

        {/* Tabs: Settings vs Controls */}
        <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
          <button
            onClick={() => {
              audioManager.playClick();
              setActiveTab('settings');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.settingsTab}
          </button>
          <button
            onClick={() => {
              audioManager.playClick();
              setActiveTab('controls');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              activeTab === 'controls'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {t.controlsTab}
          </button>
        </div>

        {/* TAB 1: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-5 overflow-y-auto pr-1 flex-1">
            {/* Audio Section */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Sound & Audio Controls</span>
                <button
                  onClick={handleTestSound}
                  className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-400 px-2 py-0.5 rounded font-bold"
                >
                  Test Chime
                </button>
              </div>

              {/* Master Volume */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span>{t.masterVolume}</span>
                  <span className="font-bold text-amber-400">
                    {Math.round(audioSettings.volume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioSettings.volume}
                  onChange={handleVolumeChange}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Toggles: Mute, BGM, SFX */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={handleToggleMute}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    audioSettings.isMuted
                      ? 'border-rose-500/50 bg-rose-950/30 text-rose-300'
                      : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {audioSettings.isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{audioSettings.isMuted ? 'Muted' : 'Sound On'}</span>
                </button>

                <button
                  onClick={handleToggleBgm}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    audioSettings.isBgmActive
                      ? 'border-amber-500/50 bg-amber-950/30 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Music className="w-4 h-4 text-amber-400" />
                  <span>BGM {audioSettings.isBgmActive ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={handleToggleSfx}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition ${
                    audioSettings.isSfxActive
                      ? 'border-sky-500/50 bg-sky-950/30 text-sky-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Bell className="w-4 h-4 text-sky-400" />
                  <span>SFX {audioSettings.isSfxActive ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>{t.languageSelect}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    audioManager.playClick();
                    onLanguageChange('en');
                  }}
                  className={`py-2 rounded-xl border text-xs font-bold transition ${
                    language === 'en'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => {
                    audioManager.playClick();
                    onLanguageChange('hi');
                  }}
                  className={`py-2 rounded-xl border text-xs font-bold transition ${
                    language === 'hi'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  हिंदी (Hindi)
                </button>
                <button
                  onClick={() => {
                    audioManager.playClick();
                    onLanguageChange('te');
                  }}
                  className={`py-2 rounded-xl border text-xs font-bold transition ${
                    language === 'te'
                      ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  తెలుగు (Telugu)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONTROLS GUIDE */}
        {activeTab === 'controls' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-amber-400" />
                <span>{t.keyboardControls}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Move Player</span>
                  <div className="flex gap-1 font-mono text-[11px]">
                    <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">W</span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">A</span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">S</span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">D</span>
                    <span className="text-slate-500 px-1">or</span>
                    <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700">Arrows</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Talk to NPCs & Enter Cities</span>
                  <span className="px-3 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px]">
                    Space / Enter
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">Pause / Close Menus</span>
                  <span className="px-3 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-[11px]">
                    Escape (Esc)
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-sky-400" />
                <span>{t.touchControls}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When on tablets and smartphones, use the on-screen virtual directional pad in the bottom corner and tap on characters to initiate dialogue.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Quick Actions Footer */}
        <div className="pt-4 mt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {onOpenQuests && (
            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
                onOpenQuests();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Quests</span>
            </button>
          )}

          {onOpenAchievements && (
            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
                onOpenAchievements();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Award className="w-3.5 h-3.5 text-sky-400" />
              <span>Trophies</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={() => {
                audioManager.playClick();
                onClose();
                onLogout();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
            >
              <span>Log Out</span>
            </button>
          )}

          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
              onReturnToHome();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>Home</span>
          </button>
        </div>

        {/* Resume Button */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => {
              audioManager.playClick();
              onClose();
            }}
            className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{t.resumeGame}</span>
          </button>

          <button
            onClick={() => {
              audioManager.playClick();
              onResetProgress();
            }}
            title="Reset Progress"
            className="p-3 bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 rounded-xl transition border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
